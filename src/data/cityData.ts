export interface CityInfo {
  name: string;
  slug: string;
  state: string;
  tagline: string;
  description: string;
  landmarks: string;
  image: string;
  filmIndustry: string;
  movies: {
    title: string;
    year: number;
    director: string;
    genre: string;
    synopsis: string;
  }[];
  highlights: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export const cityData: Record<string, CityInfo> = {
  mumbai: {
    name: "Mumbai",
    slug: "mumbai",
    state: "Maharashtra",
    tagline: "The City of Dreams",
    description:
      "India's financial capital and the heart of Bollywood. From the iconic Marine Drive to the vibrant nightlife, Mumbai never sleeps.",
    landmarks: "📍 Marine Drive | Bandra | Juhu | Colaba",
    image:
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200&q=80",
    filmIndustry: "Bollywood Blockbusters",
    movies: [
      { title: "Dil Chahta Hai", year: 2001, director: "Farhan Akhtar", genre: "Drama, Comedy", synopsis: "Three inseparable friends navigate life and love after college, set against the vibrant backdrop of Mumbai." },
      { title: "Wake Up Sid", year: 2009, director: "Ayan Mukerji", genre: "Drama, Romance", synopsis: "A lazy college graduate discovers purpose through friendship and Mumbai's monsoon charm." },
      { title: "Gully Boy", year: 2019, director: "Zoya Akhtar", genre: "Drama, Music", synopsis: "A boy from Mumbai's Dharavi slums rises to become a street rapper, inspired by real-life artists." },
      { title: "Dhobi Ghat", year: 2011, director: "Kiran Rao", genre: "Drama", synopsis: "Four lives intertwine in Mumbai — a painter, a banker, a washerwoman, and a woman exploring the city through old tapes." },
      { title: "Slumdog Millionaire", year: 2008, director: "Danny Boyle", genre: "Drama, Romance", synopsis: "A teenager from Mumbai's slums wins a quiz show, narrating his life story through each answer." },
      { title: "Satya", year: 1998, director: "Ram Gopal Varma", genre: "Crime, Thriller", synopsis: "A newcomer to Mumbai gets pulled into the city's underworld. A gritty portrayal of organized crime." },
    ],
    highlights: [
      { icon: "🎬", title: "Bollywood Capital", description: "Home to India's largest film industry, Film City, and countless shooting locations." },
      { icon: "🌊", title: "Coastal Beauty", description: "Marine Drive, Juhu Beach, and the iconic Gateway of India along the Arabian Sea." },
      { icon: "🍔", title: "Street Food Haven", description: "Vada Pav, Pav Bhaji, Bhel Puri — Mumbai's street food is legendary across India." },
    ],
  },
  delhi: {
    name: "Delhi",
    slug: "delhi",
    state: "National Capital Territory",
    tagline: "The Heart of India",
    description:
      "Where history meets modernity. From the majestic Red Fort to bustling Connaught Place, experience the vibrant culture, street food, and world-class events.",
    landmarks: "📍 Connaught Place | Hauz Khas | Chandni Chowk",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
    filmIndustry: "Bollywood Classics",
    movies: [
      { title: "Delhi-6", year: 2009, director: "Rakeysh Omprakash Mehra", genre: "Drama, Musical", synopsis: "An NRI returns to Old Delhi and gets caught up in the neighborhood's colorful life, superstitions, and communal tensions." },
      { title: "Rang De Basanti", year: 2006, director: "Rakeysh Omprakash Mehra", genre: "Drama, Action", synopsis: "A group of Delhi University students become revolutionaries after participating in a documentary about Indian freedom fighters." },
      { title: "Chak De! India", year: 2007, director: "Shimit Amin", genre: "Sports, Drama", synopsis: "A disgraced hockey player coaches the Indian women's team to glory. Iconic scenes at Delhi's National Stadium." },
      { title: "Delhi Belly", year: 2011, director: "Abhinay Deo", genre: "Comedy, Action", synopsis: "Three roommates in Delhi get caught up in a gangster's diamonds, leading to hilarious chaos across the city." },
      { title: "Khosla Ka Ghosla", year: 2006, director: "Dibakar Banerjee", genre: "Comedy, Drama", synopsis: "A middle-class Delhi man fights to reclaim his plot from a land mafia. A satirical take on Delhi's real estate." },
      { title: "Vicky Donor", year: 2012, director: "Shoojit Sircar", genre: "Comedy, Drama", synopsis: "A young Delhi man becomes a sperm donor, set against the colorful backdrop of Lajpat Nagar." },
    ],
    highlights: [
      { icon: "🏛️", title: "Rich Heritage", description: "Home to Red Fort, Qutub Minar, India Gate, and countless Mughal-era monuments." },
      { icon: "🍛", title: "Street Food Paradise", description: "Famous for Chaat, Paranthas, Kebabs, and the legendary Chandni Chowk food trail." },
      { icon: "🎭", title: "Cultural Hub", description: "India's premier destination for concerts, theatre, art exhibitions, and international events." },
    ],
  },
  bangalore: {
    name: "Bangalore",
    slug: "bangalore",
    state: "Karnataka",
    tagline: "The Silicon Valley of India",
    description:
      "India's tech capital blending startup culture with rich Kannada heritage. From craft breweries to classical music, Bangalore offers a unique mix.",
    landmarks: "📍 MG Road | Koramangala | Indiranagar | Whitefield",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
    filmIndustry: "Sandalwood Hits",
    movies: [
      { title: "KGF: Chapter 1", year: 2018, director: "Prashanth Neel", genre: "Action, Drama", synopsis: "A young man from Mumbai rises to power in the gold mines of Kolar. A pan-India Kannada blockbuster." },
      { title: "KGF: Chapter 2", year: 2022, director: "Prashanth Neel", genre: "Action, Drama", synopsis: "Rocky's reign continues as he battles powerful enemies. One of India's highest-grossing films." },
      { title: "Lucia", year: 2013, director: "Pawan Kumar", genre: "Thriller, Fantasy", synopsis: "A parallel reality thriller about a cinema usher in Bangalore. Crowd-funded Kannada cinema landmark." },
      { title: "Ulidavaru Kandanthe", year: 2014, director: "Rakshit Shetty", genre: "Crime, Drama", synopsis: "A non-linear crime drama set in coastal Karnataka, celebrated for its unique storytelling." },
      { title: "Kirik Party", year: 2016, director: "Rishab Shetty", genre: "Comedy, Romance", synopsis: "College life, friendships, and romance in a Bangalore engineering college." },
      { title: "Kantara", year: 2022, director: "Rishab Shetty", genre: "Action, Thriller", synopsis: "A Kambala champion fights to protect his land and culture in coastal Karnataka." },
    ],
    highlights: [
      { icon: "💻", title: "Tech Hub", description: "Home to India's biggest tech companies, startups, and innovation labs." },
      { icon: "🍺", title: "Brewery Culture", description: "India's craft beer capital with vibrant pubs on Church Street and Indiranagar." },
      { icon: "🌳", title: "Garden City", description: "Lalbagh, Cubbon Park, and pleasant weather year-round make it a green paradise." },
    ],
  },
  chennai: {
    name: "Chennai",
    slug: "chennai",
    state: "Tamil Nadu",
    tagline: "The Gateway to South India",
    description:
      "A city steeped in Dravidian culture, classical arts, and Marina Beach's charm. Chennai is the home of Kollywood and Carnatic music.",
    landmarks: "📍 Marina Beach | T. Nagar | Anna Nagar | Mylapore",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
    filmIndustry: "Kollywood Gems",
    movies: [
      { title: "Vikram", year: 2022, director: "Lokesh Kanagaraj", genre: "Action, Thriller", synopsis: "A retired agent investigates a series of murders, uncovering a drug cartel. A landmark in Tamil cinema." },
      { title: "Vada Chennai", year: 2018, director: "Vetrimaaran", genre: "Crime, Drama", synopsis: "A carrom player gets entangled in North Chennai's gang wars spanning decades." },
      { title: "96", year: 2018, director: "C. Prem Kumar", genre: "Romance, Drama", synopsis: "A travel photographer reunites with his school sweetheart at a reunion. A heartwarming Chennai love story." },
      { title: "Super Deluxe", year: 2019, director: "Thiagarajan Kumararaja", genre: "Drama, Comedy", synopsis: "Four interconnected stories in Chennai exploring identity, faith, and morality." },
      { title: "Soorarai Pottru", year: 2020, director: "Sudha Kongara", genre: "Drama, Biography", synopsis: "Inspired by Air Deccan founder, a man from Tamil Nadu fights to start a low-cost airline." },
      { title: "Jai Bhim", year: 2021, director: "T.J. Gnanavel", genre: "Drama, Legal", synopsis: "A lawyer fights for justice for a tribal couple. Based on true events from Tamil Nadu." },
    ],
    highlights: [
      { icon: "🏖️", title: "Beach Capital", description: "Marina Beach — the second longest urban beach in the world, stretching 13 km." },
      { icon: "🎵", title: "Classical Arts", description: "Epicenter of Carnatic music and Bharatanatyam with the famous December Music Season." },
      { icon: "🛕", title: "Temple Town", description: "Ancient Dravidian temples including Kapaleeshwarar and nearby Mahabalipuram." },
    ],
  },
  kolkata: {
    name: "Kolkata",
    slug: "kolkata",
    state: "West Bengal",
    tagline: "The City of Joy",
    description:
      "India's cultural capital with a rich literary heritage, Durga Puja celebrations, and the legendary Tollywood film industry.",
    landmarks: "📍 Park Street | Howrah | Salt Lake | New Town",
    image:
      "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&q=80",
    filmIndustry: "Tollygunge Classics",
    movies: [
      { title: "Pather Panchali", year: 1955, director: "Satyajit Ray", genre: "Drama", synopsis: "The first part of the Apu Trilogy. A masterpiece of world cinema depicting rural Bengal." },
      { title: "Kahaani", year: 2012, director: "Sujoy Ghosh", genre: "Thriller", synopsis: "A pregnant woman searches for her missing husband through the streets of Kolkata during Durga Puja." },
      { title: "Parineeta", year: 2005, director: "Pradeep Sarkar", genre: "Romance, Drama", synopsis: "A love story set in 1960s Kolkata, capturing the city's old-world charm and class divides." },
      { title: "Barfi!", year: 2012, director: "Anurag Basu", genre: "Comedy, Romance", synopsis: "A deaf-mute man's adventures and love story in Darjeeling and Kolkata." },
      { title: "Detective Byomkesh Bakshy!", year: 2015, director: "Dibakar Banerjee", genre: "Mystery, Thriller", synopsis: "A reimagined detective story set in 1940s Calcutta during WWII." },
      { title: "Feluda: Joi Baba Felunath", year: 1979, director: "Satyajit Ray", genre: "Mystery, Adventure", synopsis: "The iconic Bengali detective investigates idol smuggling in Varanasi." },
    ],
    highlights: [
      { icon: "📚", title: "Literary Capital", description: "Home to Nobel laureates, Coffee House intellectuals, and the world's largest book fair." },
      { icon: "🎭", title: "Durga Puja", description: "The grandest festival in India — immersive art installations and cultural extravaganza." },
      { icon: "🍬", title: "Sweet Capital", description: "Rosogolla, Sandesh, Mishti Doi — Kolkata's legendary sweets are known worldwide." },
    ],
  },
  hyderabad: {
    name: "Hyderabad",
    slug: "hyderabad",
    state: "Telangana",
    tagline: "The City of Pearls",
    description:
      "Where ancient Charminar meets modern HITEC City. Experience the rich Nizami heritage, delectable Biryani, and world-class Telugu cinema.",
    landmarks: "📍 HITEC City | Jubilee Hills | Charminar",
    image:
      "https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=1200&q=80",
    filmIndustry: "Tollywood Blockbusters",
    movies: [
      { title: "Baahubali: The Beginning", year: 2015, director: "S.S. Rajamouli", genre: "Action, Drama", synopsis: "An epic tale of a warrior raised in obscurity who discovers his royal lineage. Shot at Ramoji Film City." },
      { title: "RRR", year: 2022, director: "S.S. Rajamouli", genre: "Action, Drama", synopsis: "A fictional story of two Indian revolutionaries against British rule. Produced in Hyderabad." },
      { title: "Pushpa: The Rise", year: 2021, director: "Sukumar", genre: "Action, Thriller", synopsis: "A laborer rises through the ranks of a red sandalwood smuggling syndicate." },
      { title: "Arjun Reddy", year: 2017, director: "Sandeep Reddy Vanga", genre: "Drama, Romance", synopsis: "A brilliant but short-tempered surgeon spirals into self-destruction after a heartbreak." },
      { title: "Mahanati", year: 2018, director: "Nag Ashwin", genre: "Biography, Drama", synopsis: "The biographical story of legendary actress Savitri. Captures old Hyderabad's charm." },
      { title: "Jersey", year: 2019, director: "Gowtam Tinnanuri", genre: "Drama, Sports", synopsis: "A failed cricketer decides to return to the game in his late thirties for his son's dream." },
    ],
    highlights: [
      { icon: "🏛️", title: "Historic Heritage", description: "Home to the iconic Charminar, Golconda Fort, and countless monuments of the Nizams era." },
      { icon: "🎬", title: "Film Capital", description: "Ramoji Film City — the world's largest film studio complex and heart of Telugu cinema." },
      { icon: "🍚", title: "Culinary Paradise", description: "Famous for Hyderabadi Biryani, Haleem, Irani Chai, and rich Nizami cuisine." },
    ],
  },
  jaipur: {
    name: "Jaipur",
    slug: "jaipur",
    state: "Rajasthan",
    tagline: "The Pink City",
    description:
      "Royal palaces, vibrant bazaars, and Rajasthani culture at its finest. Jaipur is a visual feast of architecture and heritage.",
    landmarks: "📍 Hawa Mahal | Amer Fort | Johari Bazaar",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80",
    filmIndustry: "Rajasthani Cinema",
    movies: [
      { title: "Paheli", year: 2005, director: "Amol Palekar", genre: "Fantasy, Romance", synopsis: "A ghost falls in love with a newlywed bride in Rajasthan. India's Oscar entry that year." },
      { title: "Jodha Akbar", year: 2008, director: "Ashutosh Gowariker", genre: "Historical, Romance", synopsis: "The epic love story between Mughal Emperor Akbar and Rajput princess Jodha." },
      { title: "The Best Exotic Marigold Hotel", year: 2011, director: "John Madden", genre: "Comedy, Drama", synopsis: "British retirees travel to India to stay in a newly restored hotel in Jaipur." },
      { title: "Bajirao Mastani", year: 2015, director: "Sanjay Leela Bhansali", genre: "Historical, Romance", synopsis: "The love story of Peshwa Bajirao I, with sequences shot at Rajasthani forts." },
    ],
    highlights: [
      { icon: "🏰", title: "Royal Heritage", description: "Amer Fort, City Palace, and Hawa Mahal — a UNESCO World Heritage destination." },
      { icon: "🛍️", title: "Bazaar Culture", description: "Johari Bazaar for gems, Bapu Bazaar for textiles, and vibrant handicraft markets." },
      { icon: "🐘", title: "Cultural Festivals", description: "Jaipur Literature Festival, Elephant Festival, and the Kite Festival are world-famous." },
    ],
  },
  pune: {
    name: "Pune",
    slug: "pune",
    state: "Maharashtra",
    tagline: "Oxford of the East",
    description:
      "India's education hub with a thriving cultural scene, pleasant weather, and a burgeoning food and nightlife culture.",
    landmarks: "📍 FC Road | Koregaon Park | Shaniwar Wada | Hinjewadi",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
    filmIndustry: "Marathi Cinema",
    movies: [
      { title: "Sairat", year: 2016, director: "Nagraj Manjule", genre: "Romance, Drama", synopsis: "A cross-caste love story that became the highest-grossing Marathi film. Raw and powerful." },
      { title: "Court", year: 2014, director: "Chaitanya Tamhane", genre: "Drama", synopsis: "A look at India's judicial system through a folk singer's trial. Premiered at Venice Film Festival." },
      { title: "Natrang", year: 2010, director: "Ravi Jadhav", genre: "Drama, Musical", synopsis: "A man's passion for folk theatre challenges societal norms in rural Maharashtra." },
      { title: "Harishchandrachi Factory", year: 2009, director: "Paresh Mokashi", genre: "Biography, Comedy", synopsis: "The story of Dadasaheb Phalke creating India's first feature film." },
    ],
    highlights: [
      { icon: "🎓", title: "Education Hub", description: "Home to prestigious universities, research institutes, and a vibrant student culture." },
      { icon: "🏔️", title: "Hill Station Gateway", description: "Close to Lonavala, Mahabaleshwar, and the Western Ghats for weekend getaways." },
      { icon: "🎶", title: "Live Music Scene", description: "Thriving indie music scene with venues in Koregaon Park and FC Road." },
    ],
  },
};

export const getCityBySlug = (slug: string): CityInfo | undefined => {
  return cityData[slug.toLowerCase()];
};

export const getAllCitySlugs = (): string[] => {
  return Object.keys(cityData);
};
