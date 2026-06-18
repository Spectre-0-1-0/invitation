import { MetadataRoute } from 'next';
import { getSeniors, getMemories } from '@/lib/data-fetcher';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seniors = await getSeniors();
  const memories = await getMemories();

  const seniorUrls = seniors.map((senior) => ({
    url: `https://archive.college.edu/people/${senior.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const memoryUrls = memories.map((memory) => ({
    url: `https://archive.college.edu/gallery/${memory.id}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [
    {
      url: 'https://archive.college.edu',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://archive.college.edu/people',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://archive.college.edu/gallery',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...seniorUrls,
    ...memoryUrls,
  ];
}
