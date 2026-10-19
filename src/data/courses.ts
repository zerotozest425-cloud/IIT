export interface Course {
  id: string
  name: string
  shortName: string
  price: number
  category: string
  description: string
  features: string[]
  modules: string[]
  thumbnail: string
}

export const courses: Course[] = [
  {
    id: "canva",
    name: "Canva Complete Course",
    shortName: "Canva",
    price: 197,
    category: "Design",
    thumbnail: "canva",
    description:
      "Master Canva and learn how to create professional graphics, social media posts, posters, thumbnails, presentations and other stunning visual content.",
    features: [
      "Canva fundamentals",
      "Professional designs",
      "Social media graphics",
      "Posters & banners",
      "YouTube thumbnails",
      "Practical projects",
    ],
    modules: [
      "Getting started with Canva",
      "Layouts, typography & color",
      "Creating social media graphics",
      "Posters, banners & thumbnails",
      "Presentations & practical design projects",
      "Exporting and sharing your work",
    ],
  },
  {
    id: "video-editing",
    name: "Premiere Pro Video Editing Complete Course",
    shortName: "Premiere Pro Editing",
    price: 197,
    category: "Video",
    thumbnail: "video",
    description:
      "Learn professional video editing in Adobe Premiere Pro and create engaging videos for YouTube, Instagram and other platforms.",
    features: [
      "Premiere Pro basics",
      "Cutting & trimming",
      "Transitions",
      "Text & effects",
      "Audio editing",
      "Social media videos",
    ],
    modules: [
      "Getting started with Premiere Pro",
      "Importing footage & using timelines",
      "Cutting, trimming & transitions",
      "Text, titles & visual effects",
      "Audio editing essentials",
      "Exporting videos for social media",
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT Complete Course",
    shortName: "ChatGPT",
    price: 197,
    category: "AI & Productivity",
    thumbnail: "chatgpt",
    description:
      "Learn how to use ChatGPT effectively for learning, content creation, productivity, research and everyday work.",
    features: [
      "ChatGPT basics",
      "Prompting",
      "Content creation",
      "Productivity",
      "AI tools",
      "Practical use cases",
    ],
    modules: [
      "Getting to know ChatGPT",
      "Writing effective prompts",
      "Creating & refining content",
      "Research and checking AI outputs",
      "Everyday productivity & AI tools",
      "Practical use cases",
    ],
  },
  {
    id: "facebook-ads",
    name: "Digital Marketing Full Course",
    shortName: "Digital Marketing",
    price: 197,
    category: "Marketing",
    thumbnail: "marketing",
    description:
      "Learn the fundamentals of Facebook advertising and understand how to create and manage effective ad campaigns.",
    features: [
      "Facebook Ads basics",
      "Campaign creation",
      "Audience targeting",
      "Ad creatives",
      "Budgeting",
      "Campaign optimization",
    ],
    modules: [
      "Introduction to Facebook Ads",
      "Campaign objectives & setup",
      "Understanding your audience",
      "Building effective ad creatives",
      "Budgets & campaign management",
      "Reading results & optimizing campaigns",
    ],
  },
  {
    id: "wordpress",
    name: "WordPress Complete Course",
    shortName: "WordPress",
    price: 197,
    category: "Web Development",
    thumbnail: "wordpress",
    description:
      "Learn how to create and manage professional websites using WordPress.",
    features: [
      "WordPress basics",
      "Website setup",
      "Themes",
      "Plugins",
      "Pages & menus",
      "Website customization",
    ],
    modules: [
      "Introduction to WordPress",
      "Setting up your website",
      "Choosing & customizing a theme",
      "Working with plugins",
      "Creating pages & navigation",
      "Managing and maintaining your site",
    ],
  },
  {
    id: "3d-animation",
    name: "3D Animation Complete Course",
    shortName: "3D Animation",
    price: 197,
    category: "Animation",
    thumbnail: "animation",
    description:
      "Learn the fundamentals of 3D animation and create engaging animated scenes from scratch.",
    features: [
      "Animation fundamentals",
      "3D modelling",
      "Materials & lighting",
      "Rigging & motion",
      "Scene building",
      "Practical projects",
    ],
    modules: [
      "Introduction to 3D animation",
      "Creating basic 3D models",
      "Materials, textures & lighting",
      "Rigging, motion & keyframes",
      "Building and rendering scenes",
      "Your first 3D animation project",
    ],
  },
  {
    id: "motivational-ebooks",
    name: "1000+ Motivational E-books",
    shortName: "1000+ E-books",
    price: 197,
    category: "E-books",
    thumbnail: "ebooks",
    description:
      "Build your digital library with 1000+ motivational e-books covering personal growth, success, habits, productivity, leadership and more.",
    features: [
      "1000+ digital books",
      "Motivation & success",
      "Personal growth",
      "Productivity & habits",
      "Leadership",
      "Read from anywhere",
    ],
    modules: [
      "Motivation & success collection",
      "Self-discipline & confidence",
      "Personal growth & mindset",
      "Productivity & powerful habits",
      "Leadership & communication",
      "Business & financial thinking",
    ],
  },
]

export const bundle: Course = {
  id: "all-courses",
  name: "Ultimate Digital Skills Bundle",
  shortName: "All 7 Courses",
  price: 199,
  category: "Complete Bundle",
  thumbnail: "bundle",
  description:
    "Get access to all featured courses and the motivational e-book collection at one special bundle price. Build your toolkit with design, video, AI, advertising, websites, animation and personal growth.",
  features: courses.map((course) => course.shortName),
  modules: courses.map((course) => course.name),
}
