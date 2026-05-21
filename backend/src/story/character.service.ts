import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Note } from '../entities/note.entity';
import { Story } from '../entities/story.entity';

@Injectable()
export class CharacterService {
  constructor(private readonly em: EntityManager) {}

  async getCharacterProfile(userId: string, storyId: string): Promise<any> {
    await this.em.findOneOrFail(Story, { id: storyId, user: { id: userId } });

    const notes = await this.em.find(Note, { story: { id: storyId } }, {
      orderBy: { createdAt: 'ASC' },
    });

    // Find all character nodes
    const characterNodes = notes.filter(n => n.storyNodeType === 'character');

    // Aggregate mentions across all nodes
    const characters = characterNodes.map(charNode => {
      let metadata: any = {};
      try { if (charNode.storyMetadata) metadata = JSON.parse(charNode.storyMetadata); } catch {}

      const characterName = metadata.characterName || charNode.title || 'Unknown';

      // Find all nodes that mention this character (by name in content/title)
      const mentions = notes.filter(n => {
        if (n.id === charNode.id) return false;
        const text = `${n.title || ''} ${(n.content || '').replace(/<[^>]+>/g, '')}`.toLowerCase();
        return text.includes(characterName.toLowerCase());
      });

      // Mood distribution in mentions
      const moodInMentions: Record<string, number> = {};
      mentions.forEach(m => {
        if (m.mood) moodInMentions[m.mood] = (moodInMentions[m.mood] || 0) + 1;
      });

      // Node types where character appears
      const nodeTypesAppearing: Record<string, number> = {};
      mentions.forEach(m => {
        const t = m.storyNodeType || 'scene';
        nodeTypesAppearing[t] = (nodeTypesAppearing[t] || 0) + 1;
      });

      // Timeline of appearances
      const appearances = mentions.map(m => ({
        nodeId: m.id,
        title: m.title || 'Untitled',
        nodeType: m.storyNodeType || 'scene',
        mood: m.mood || null,
        createdAt: m.createdAt,
      }));

      // Character description from their own node
      const description = (charNode.content || '').replace(/<[^>]+>/g, '').slice(0, 300);

      // Total words written about this character
      const totalWords = mentions.reduce((sum, m) => {
        const text = (m.content || '').replace(/<[^>]+>/g, '');
        return sum + text.split(/\s+/).filter((w: string) => w.length > 0).length;
      }, 0);

      return {
        nodeId: charNode.id,
        name: characterName,
        description,
        mood: charNode.mood || null,
        totalMentions: mentions.length,
        totalWords,
        moodDistribution: Object.entries(moodInMentions).map(([mood, count]) => ({ mood, count })),
        nodeTypesAppearing: Object.entries(nodeTypesAppearing).map(([type, count]) => ({ type, count })),
        appearances: appearances.slice(0, 10),
        firstAppearance: appearances.length > 0 ? appearances[0].createdAt : charNode.createdAt,
        lastAppearance: appearances.length > 0 ? appearances[appearances.length - 1].createdAt : charNode.createdAt,
      };
    });

    // Overall character stats
    const totalCharacters = characters.length;
    const mostMentioned = characters.sort((a, b) => b.totalMentions - a.totalMentions)[0] || null;

    return {
      characters,
      totalCharacters,
      mostMentioned: mostMentioned ? { name: mostMentioned.name, mentions: mostMentioned.totalMentions } : null,
    };
  }
}
