export const mockProjects = [
  {
    id: 'meridian-tower',
    title: 'The Meridian Tower',
    author: {
      id: 'a1',
      name: 'Elena Rostova',
      handle: 'elenarostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role: 'Principal Architect · London',
      verified: true,
      stats: { projects: 28, followers: '1.2k', following: 412 },
      bio: 'Award-winning architect specializing in sustainable urban high-rises and biophilic design.'
    },
    category: 'Mixed-Use',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    description: 'A 42-story mixed-use development featuring integrated vertical gardens, passive cooling, and a dynamic kinetic facade that adapts to sunlight.',
    tags: ['#sustainable', '#highrise', '#2024', '#parametric'],
    location: 'London, UK',
    area: '120,000 sq ft',
    year: '2024',
    stats: {
      upvotes: 428,
      saves: 156,
      views: '3.2k',
      forks: 42
    },
    createdAt: '2 days ago',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 'villa-kuro',
    title: 'Villa Kuro',
    author: {
      id: 'a2',
      name: 'Kenji Sato',
      handle: 'kenjisato',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      role: 'Independent Architect · Kyoto',
      verified: false,
      stats: { projects: 12, followers: '840', following: 120 },
      bio: 'Exploring the intersection of traditional Japanese aesthetics and modern minimalism.'
    },
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
    description: 'A minimalist retreat nestled in the hills of Kyoto, utilizing charred timber cladding (Shou Sugi Ban) and expansive glass to blend interior and exterior spaces.',
    tags: ['#minimalist', '#residential', '#timber', '#retreat'],
    location: 'Kyoto, Japan',
    area: '3,200 sq ft',
    year: '2023',
    stats: {
      upvotes: 284,
      saves: 91,
      views: '1.2k',
      forks: 34
    },
    createdAt: '3 days ago',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 'brutalist-archive',
    title: 'National Data Archive',
    author: {
      id: 'a3',
      name: 'Marcus Vance',
      handle: 'vance_arch',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      role: 'Senior Partner · Berlin',
      verified: true,
      stats: { projects: 45, followers: '3.4k', following: 800 },
      bio: 'Brutalist revivalist. Designing structures that convey permanence and security.'
    },
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=1000',
    description: 'A contemporary take on brutalism, designed to house national data servers. The fortress-like exterior contrasts with a light-filled, cavernous interior atrium.',
    tags: ['#brutalist', '#concrete', '#monumental', '#archive'],
    location: 'Berlin, Germany',
    area: '85,000 sq ft',
    year: '2024',
    stats: {
      upvotes: 512,
      saves: 210,
      views: '4.5k',
      forks: 67
    },
    createdAt: '1 week ago',
    images: [
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 'oasis-pavilion',
    title: 'The Oasis Pavilion',
    author: {
      id: 'a4',
      name: 'Sarah Jenkins',
      handle: 'sjenkins',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'Landscape Architect · Dubai',
      verified: true,
      stats: { projects: 18, followers: '2.1k', following: 350 },
      bio: 'Creating sustainable micro-climates in arid environments.'
    },
    category: 'Landscape',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?auto=format&fit=crop&q=80&w=1000',
    description: 'A shading structure and public park designed to reduce ambient temperatures using traditional windcatcher concepts and misting systems.',
    tags: ['#landscape', '#publicspace', '#cooling', '#parametric'],
    location: 'Dubai, UAE',
    area: '12,000 sq ft',
    year: '2024',
    stats: {
      upvotes: 195,
      saves: 72,
      views: '980',
      forks: 15
    },
    createdAt: '2 weeks ago',
    images: [
      'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    id: 'nordic-museum',
    title: 'Nordic Heritage Museum',
    author: {
      id: 'a5',
      name: 'Anders Berg',
      handle: 'aberg_design',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      role: 'Lead Architect · Oslo',
      verified: false,
      stats: { projects: 8, followers: '450', following: 112 },
      bio: 'Focusing on cultural institutions that respond to their environment.'
    },
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1541886121932-159624564cda?auto=format&fit=crop&q=80&w=1000',
    description: 'An extension to an existing historic building, utilizing sweeping laminated timber beams to create a fluid transition between old and new.',
    tags: ['#museum', '#timber', '#heritage', '#fluid'],
    location: 'Oslo, Norway',
    area: '45,000 sq ft',
    year: '2025',
    stats: {
      upvotes: 340,
      saves: 145,
      views: '2.1k',
      forks: 28
    },
    createdAt: '1 month ago',
    images: [
      'https://images.unsplash.com/photo-1541886121932-159624564cda?auto=format&fit=crop&q=80&w=1000'
    ]
  }
];
