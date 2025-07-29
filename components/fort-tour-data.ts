export interface TourStep {
  id: string;
  title: string;
  description: string;
  position: { lat: number; lng: number };
  pov: { heading: number; pitch: number };
  imageUrl?: string;
  facts: string[];
  historicalInfo: string;
  duration: number; // in seconds
}

export interface FortTour {
  fortName: string;
  overview: string;
  totalDuration: number; // in minutes
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  bestTime: string;
  steps: TourStep[];
}

export const FORT_TOURS: Record<string, FortTour> = {
  "Sinhagad Fort Trek": {
    fortName: "Sinhagad Fort",
    overview: "A historic hill fortress located in the Pune district of Maharashtra, India. Known for the legendary battle where Tanaji Malusare sacrificed his life to capture the fort.",
    totalDuration: 45,
    difficulty: "Moderate",
    bestTime: "Monsoon and Winter (July to March)",
    steps: [
      {
        id: "entrance",
        title: "Main Entrance - Kalyan Darwaza",
        description: "The grand entrance to Sinhagad Fort, built during the Maratha Empire. This was the main gateway used by warriors and traders.",
        position: { lat: 18.366401, lng: 73.754601 },
        pov: { heading: 45, pitch: 10 },
        facts: [
          "Built in the 17th century by Shivaji Maharaj",
          "Named after the legendary warrior Tanaji Malusare",
          "Height: 1,312 meters above sea level"
        ],
        historicalInfo: "The fort was originally called 'Kondhana' and was captured by Shivaji Maharaj in 1670. Tanaji Malusare used a monitor lizard (ghorpad) to scale the walls, leading to the famous battle.",
        duration: 300
      },
      {
        id: "tanaji-memorial",
        title: "Tanaji Memorial",
        description: "A memorial dedicated to the brave warrior Tanaji Malusare who sacrificed his life capturing this fort.",
        position: { lat: 18.366601, lng: 73.755001 },
        pov: { heading: 90, pitch: 0 },
        facts: [
          "Tanaji used a monitor lizard to scale the walls",
          "The battle took place on February 4, 1670",
          "Shivaji renamed the fort 'Sinhagad' (Lion's Fort)"
        ],
        historicalInfo: "Tanaji Malusare was a trusted commander of Shivaji Maharaj. During the battle, he tied a rope around a monitor lizard and used it to scale the steep walls. Though he captured the fort, he lost his life in the process.",
        duration: 240
      },
      {
        id: "panoramic-view",
        title: "Panoramic Valley View",
        description: "Breathtaking views of the Sahyadri mountains and surrounding valleys. Perfect spot for photography and meditation.",
        position: { lat: 18.366901, lng: 73.755301 },
        pov: { heading: 180, pitch: -10 },
        facts: [
          "Offers 360-degree views of the Western Ghats",
          "Visible distance: up to 50 km on clear days",
          "Popular spot for sunrise and sunset views"
        ],
        historicalInfo: "This strategic location was used by Maratha warriors to monitor enemy movements and communicate with other forts using smoke signals and mirrors.",
        duration: 180
      },
      {
        id: "water-cisterns",
        title: "Ancient Water Cisterns",
        description: "Historic water storage systems that provided drinking water to the fort's inhabitants during sieges.",
        position: { lat: 18.367101, lng: 73.754901 },
        pov: { heading: 270, pitch: 5 },
        facts: [
          "Built using advanced engineering techniques",
          "Could store water for months during sieges",
          "Still functional after 300+ years"
        ],
        historicalInfo: "The water cisterns were crucial for the fort's survival during long sieges. They were designed to collect rainwater and store it efficiently, ensuring the fort never ran out of water.",
        duration: 120
      }
    ]
  },
  "Rajgad Fort Trek": {
    fortName: "Rajgad Fort",
    overview: "One of the most important forts in Maharashtra, known as the 'King of Forts'. It served as the capital of the Maratha Empire for 26 years.",
    totalDuration: 60,
    difficulty: "Challenging",
    bestTime: "Post-monsoon (October to March)",
    steps: [
      {
        id: "padmavati-machi",
        title: "Padmavati Machi",
        description: "The main residential area of the fort where the royal family and courtiers lived. Named after Queen Padmavati.",
        position: { lat: 18.248401, lng: 73.682701 },
        pov: { heading: 0, pitch: 0 },
        facts: [
          "Named after Shivaji's mother Jijabai",
          "Housed the royal palace and administrative offices",
          "Contains ancient temples and residential quarters"
        ],
        historicalInfo: "Padmavati Machi was the heart of the Maratha Empire for 26 years. It housed the royal palace, administrative offices, and was the center of political activities.",
        duration: 300
      },
      {
        id: "balekilla",
        title: "Balekilla (Upper Fort)",
        description: "The highest point of the fort, offering commanding views of the entire region. Used for strategic military purposes.",
        position: { lat: 18.248901, lng: 73.683101 },
        pov: { heading: 270, pitch: 10 },
        facts: [
          "Highest point: 1,376 meters above sea level",
          "Used for military surveillance and defense",
          "Contains ancient cannons and watchtowers"
        ],
        historicalInfo: "Balekilla was the most secure part of the fort, used for military surveillance and as the last line of defense. It contains ancient cannons and watchtowers that protected the entire region.",
        duration: 240
      },
      {
        id: "sanjivani-machi",
        title: "Sanjivani Machi",
        description: "A strategic military outpost with excellent defensive positions and panoramic views of the surrounding valleys.",
        position: { lat: 18.249201, lng: 73.683501 },
        pov: { heading: 135, pitch: -5 },
        facts: [
          "Named after the mythical Sanjivani herb",
          "Used for military training and exercises",
          "Contains ancient weapon storage facilities"
        ],
        historicalInfo: "Sanjivani Machi was used for military training and as a strategic lookout point. It was named after the mythical Sanjivani herb, symbolizing the fort's ability to 'revive' and protect the kingdom.",
        duration: 180
      },
      {
        id: "pali-darwaza",
        title: "Pali Darwaza",
        description: "The main entrance gate of the fort, featuring impressive architecture and defensive mechanisms.",
        position: { lat: 18.248701, lng: 73.683301 },
        pov: { heading: 45, pitch: 0 },
        facts: [
          "Features multiple defensive layers",
          "Built with massive stone blocks",
          "Contains hidden passages and escape routes"
        ],
        historicalInfo: "Pali Darwaza was the main entrance to the fort, designed with multiple defensive layers. It features massive stone blocks and contains hidden passages for emergency escapes.",
        duration: 120
      }
    ]
  },
  "Torna Fort Trek": {
    fortName: "Torna Fort",
    overview: "The first fort captured by Shivaji Maharaj at the age of 16, marking the beginning of the Maratha Empire. Known for its strategic location and historical significance.",
    totalDuration: 40,
    difficulty: "Easy",
    bestTime: "Monsoon and Winter (July to March)",
    steps: [
      {
        id: "budhla-machi",
        title: "Budhla Machi",
        description: "The main residential area of the fort, named after the ancient Buddhist influence in the region.",
        position: { lat: 18.276701, lng: 73.622601 },
        pov: { heading: 315, pitch: 5 },
        facts: [
          "First fort captured by Shivaji at age 16",
          "Height: 1,403 meters above sea level",
          "Contains ancient Buddhist caves"
        ],
        historicalInfo: "Torna Fort was the first fort captured by Shivaji Maharaj at the age of 16, marking the beginning of the Maratha Empire. The name 'Torna' comes from the local deity 'Torneshwar'.",
        duration: 300
      },
      {
        id: "menghai-temple",
        title: "Menghai Devi Temple",
        description: "An ancient temple dedicated to the local deity Menghai Devi, showcasing the religious diversity of the region.",
        position: { lat: 18.277101, lng: 73.623001 },
        pov: { heading: 180, pitch: 0 },
        facts: [
          "Dedicated to the local deity Menghai Devi",
          "Built in ancient architectural style",
          "Still actively worshipped by locals"
        ],
        historicalInfo: "The Menghai Devi Temple represents the religious diversity of the region. It was built in ancient architectural style and is still actively worshipped by locals, showing the cultural continuity.",
        duration: 180
      },
      {
        id: "eastern-watchtower",
        title: "Eastern Watchtower",
        description: "A strategic lookout point offering panoramic views of the eastern valleys and surrounding forts.",
        position: { lat: 18.277501, lng: 73.623401 },
        pov: { heading: 90, pitch: -10 },
        facts: [
          "Offers views of multiple surrounding forts",
          "Used for communication with other forts",
          "Contains ancient signaling mechanisms"
        ],
        historicalInfo: "The Eastern Watchtower was crucial for communication with other forts in the region. It contains ancient signaling mechanisms used to communicate with forts like Rajgad and Sinhagad.",
        duration: 120
      },
      {
        id: "zunjar-machi",
        title: "Zunjar Machi",
        description: "A strategic military outpost with excellent defensive positions and storage facilities for weapons and supplies.",
        position: { lat: 18.277301, lng: 73.622801 },
        pov: { heading: 225, pitch: -5 },
        facts: [
          "Used for weapon storage and military training",
          "Contains ancient granaries and armories",
          "Strategic defensive position"
        ],
        historicalInfo: "Zunjar Machi was used for weapon storage and military training. It contains ancient granaries and armories that were crucial for the fort's defense during sieges.",
        duration: 120
      }
    ]
  }
}; 