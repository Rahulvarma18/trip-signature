// Single source of truth for package categories and destinations.
// Update this file to add/remove destinations across the whole site —
// category pages and destination detail pages are generated from this data.

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function withSlugs(items) {
  return items.map((item) => {
    const slug = slugify(item.name)
    return { ...item, slug, image: `/images/destinations/${slug}/1.png` }
  })
}

export const CATEGORIES = {
  pilgrimage: {
    key: 'pilgrimage',
    label: 'Pilgrimage & Spiritual',
    shortLabel: 'Pilgrimage',
    tagline: 'Sacred journeys across India\u2019s most revered shrines and temples.',
    items: withSlugs([
      {
        name: 'Kedarnath',
        price: '\u20b915,999',
        duration: '4 Days',
        rating: 4.9,
        description:
          'One of the twelve Jyotirlingas, set against the snow-capped Kedarnath range. Includes helicopter option, comfortable stays, and a guided darshan.',
        highlights: ['Jyotirlinga darshan', 'Optional helicopter transfer', 'Guided trek support']
      },
      {
        name: 'Kedarnath & Badrinath',
        price: '\u20b924,999',
        duration: '7 Days',
        rating: 4.8,
        description:
          'The classic twin-shrine circuit combining Kedarnath and Badrinath in one itinerary, with comfortable overnight stops along the route.',
        highlights: ['Two Char Dham shrines', 'Scenic Himalayan drive', 'Comfortable hotel stays']
      },
      {
        name: 'Char Dham Yatra',
        price: '\u20b939,999',
        duration: '11 Days',
        rating: 4.9,
        description:
          'The complete pilgrimage covering Yamunotri, Gangotri, Kedarnath and Badrinath \u2014 planned around the pace of elderly travellers.',
        highlights: ['All four dhams', 'Elder-friendly pacing', 'Dedicated pilgrimage guide']
      },
      {
        name: 'Tungnath Mahadev Temple',
        price: '\u20b911,499',
        duration: '3 Days',
        rating: 4.7,
        description:
          'The highest Shiva temple in the world, reached via a scenic ridge walk through rhododendron forests from Chopta.',
        highlights: ['World\u2019s highest Shiva temple', 'Chopta base stay', 'Moderate ridge trek']
      },
      {
        name: 'Madhya Maheswar',
        price: '\u20b913,999',
        duration: '5 Days',
        rating: 4.6,
        description:
          'One of the Panch Kedar temples, tucked in a remote alpine meadow with views of Chaukhamba peak.',
        highlights: ['Panch Kedar shrine', 'Chaukhamba views', 'Off-the-beaten-path trail']
      },
      {
        name: 'Vrindavan - Prem Mandir',
        price: '\u20b96,999',
        duration: '2 Days',
        rating: 4.7,
        description:
          'Krishna\u2019s childhood home, centred on the marble Prem Mandir and its evening light-and-sound ceremony.',
        highlights: ['Prem Mandir evening show', 'Banke Bihari darshan', 'Short weekend trip']
      },
      {
        name: 'Ayodhya',
        price: '\u20b98,999',
        duration: '2 Days',
        rating: 4.8,
        description:
          'The Ram Mandir and the ghats of the Sarayu river, with an evening aarti that draws pilgrims from across the country.',
        highlights: ['Ram Mandir darshan', 'Sarayu aarti', 'Local heritage walk']
      },
      {
        name: 'Khatu Shyam - Ringas',
        price: '\u20b95,999',
        duration: '2 Days',
        rating: 4.6,
        description:
          'A quick Rajasthan pilgrimage to the Khatu Shyam temple, especially lively during the Falgun Mela.',
        highlights: ['Khatu Shyam temple', 'Optional Falgun Mela timing', 'Easy weekend trip']
      },
      {
        name: 'Kashi Varanasi',
        price: '\u20b910,999',
        duration: '3 Days',
        rating: 4.9,
        description:
          'Sunrise boat rides on the Ganga, the Kashi Vishwanath temple, and the evening Ganga Aarti at Dashashwamedh Ghat.',
        highlights: ['Sunrise Ganga boat ride', 'Kashi Vishwanath darshan', 'Evening Ganga Aarti']
      },
      {
        name: 'Mahakal Ujjain',
        price: '\u20b98,499',
        duration: '2 Days',
        rating: 4.8,
        description:
          'The Mahakaleshwar Jyotirlinga, famous for its pre-dawn Bhasma Aarti ritual in Ujjain.',
        highlights: ['Bhasma Aarti', 'Jyotirlinga darshan', 'Compact 2-day trip']
      },
      {
        name: 'Vaishno Devi',
        price: '\u20b912,499',
        duration: '3 Days',
        rating: 4.9,
        description:
          'The cave shrine in the Trikuta hills, with options for the traditional climb, pony, or helicopter.',
        highlights: ['Trikuta hill shrine', 'Helicopter option available', 'Katra base stay']
      },
      {
        name: 'Tirupati',
        price: '\u20b99,999',
        duration: '2 Days',
        rating: 4.9,
        description:
          'Darshan of Lord Venkateswara at one of the world\u2019s most-visited pilgrimage sites, with assisted queue booking.',
        highlights: ['Assisted darshan booking', 'Tirumala hill temple', 'Compact 2-day trip']
      },
      {
        name: 'Pashupatinath',
        price: '\u20b918,999',
        duration: '4 Days',
        rating: 4.7,
        description:
          'A cross-border pilgrimage to Nepal\u2019s Pashupatinath Temple on the banks of the Bagmati river in Kathmandu.',
        highlights: ['Pashupatinath Temple', 'Kathmandu valley stay', 'Cross-border assistance']
      }
    ])
  },

  beach: {
    key: 'beach',
    label: 'Beach & Islands',
    shortLabel: 'Beach',
    tagline: 'Sun, sand and turquoise water across India\u2019s best coastlines and islands.',
    items: withSlugs([
      {
        name: 'Goa',
        price: '\u20b913,999',
        duration: '4 Days',
        rating: 4.6,
        description:
          'North and South Goa beaches, water sports, beach shacks, and a laid-back mix of Portuguese-era heritage.',
        highlights: ['North & South Goa', 'Water sports included', 'Beach shack dinners']
      },
      {
        name: 'Andaman & Nicobar',
        price: '\u20b932,999',
        duration: '6 Days',
        rating: 4.9,
        description:
          'Radhanagar Beach, Havelock Island scuba diving, and the Cellular Jail\u2019s light and sound show in Port Blair.',
        highlights: ['Havelock Island scuba diving', 'Radhanagar Beach', 'Cellular Jail history show']
      },
      {
        name: 'Lakshadweep',
        price: '\u20b936,999',
        duration: '5 Days',
        rating: 4.8,
        description:
          'Coral atolls and lagoon-blue water on Bangaram and Kavaratti, with snorkelling and glass-bottom boat rides.',
        highlights: ['Coral lagoon snorkelling', 'Bangaram Island stay', 'Limited-permit access handled for you']
      }
    ])
  },

  honeymoon: {
    key: 'honeymoon',
    label: 'Honeymoon & Leisure',
    shortLabel: 'Honeymoon',
    tagline: 'Quiet, romantic escapes designed around just the two of you.',
    items: withSlugs([
      {
        name: 'Vietnam',
        price: '\u20b989,999',
        duration: '7 Days',
        rating: 4.8,
        description:
          'Halong Bay cruises, Hoi An\u2019s lantern-lit old town, and Hanoi street food \u2014 a mix of romance and culture.',
        highlights: ['Halong Bay overnight cruise', 'Hoi An lantern old town', 'Private airport transfers']
      },
      {
        name: 'Thailand',
        price: '\u20b974,999',
        duration: '6 Days',
        rating: 4.7,
        description:
          'Phuket beaches and Bangkok nightlife, with a private island-hopping day and couple\u2019s spa included.',
        highlights: ['Phi Phi island hopping', 'Couple\u2019s spa session', 'Bangkok & Phuket combo']
      },
      {
        name: 'Bali',
        price: '\u20b979,999',
        duration: '6 Days',
        rating: 4.9,
        description:
          'Ubud rice-terrace villas, Uluwatu clifftop sunsets, and a private candlelit dinner on the beach.',
        highlights: ['Private villa with pool', 'Uluwatu sunset dinner', 'Ubud rice terrace tour']
      },
      {
        name: 'Phuket & Krabi',
        price: '\u20b969,999',
        duration: '5 Days',
        rating: 4.6,
        description:
          'Railay Beach cliffs, longtail boat tours, and beachfront resort stays across two of Thailand\u2019s most scenic coasts.',
        highlights: ['Railay Beach day trip', 'Longtail boat tour', 'Beachfront resort stay']
      },
      {
        name: 'Himachal',
        price: '\u20b924,999',
        duration: '5 Days',
        rating: 4.7,
        description:
          'Manali and Kasol in the same trip \u2014 mountain-view cottages, cafe-hopping, and short valley walks.',
        highlights: ['Manali & Kasol combo', 'Mountain-view cottage', 'Cafe-hopping itinerary']
      },
      {
        name: 'Kashmir',
        price: '\u20b929,999',
        duration: '6 Days',
        rating: 4.9,
        description:
          'A houseboat stay on Dal Lake, Gulmarg\u2019s gondola ride, and the gardens of Srinagar.',
        highlights: ['Dal Lake houseboat', 'Gulmarg gondola ride', 'Srinagar Mughal gardens']
      }
    ])
  },

  trek: {
    key: 'trek',
    label: 'Trek & Adventure',
    shortLabel: 'Trek',
    tagline: 'High-altitude trails across the Himalayas for every experience level.',
    items: withSlugs([
      {
        name: 'Kedarkantha Trek',
        price: '\u20b98,999',
        duration: '6 Days',
        rating: 4.8,
        description:
          'A beginner-friendly winter summit trek through snow-laden pine forests, with a 360\u00b0 Himalayan view from the top.',
        highlights: ['Beginner-friendly summit', '360\u00b0 Himalayan viewpoint', 'Guided winter camping']
      },
      {
        name: 'Hampta Pass Trek',
        price: '\u20b910,999',
        duration: '5 Days',
        rating: 4.7,
        description:
          'A crossover trek from green Kullu valley to the stark Lahaul desert landscape in a single day.',
        highlights: ['Valley-to-desert crossover', 'Chandratal Lake extension', 'Moderate difficulty']
      },
      {
        name: 'Valley of Flowers Trek',
        price: '\u20b911,499',
        duration: '6 Days',
        rating: 4.9,
        description:
          'A UNESCO World Heritage meadow bursting with alpine flowers, paired with the Hemkund Sahib shrine.',
        highlights: ['UNESCO heritage meadow', 'Hemkund Sahib visit', 'Best in July\u2013August bloom']
      },
      {
        name: 'Kashmir Great Lakes Trek',
        price: '\u20b915,999',
        duration: '8 Days',
        rating: 4.9,
        description:
          'Seven alpine lakes in one trail, widely considered one of the most scenic treks in the Indian Himalayas.',
        highlights: ['Seven alpine lakes', 'High-altitude campsites', 'Experienced trek leaders']
      },
      {
        name: 'Goechala Trek',
        price: '\u20b917,999',
        duration: '10 Days',
        rating: 4.8,
        description:
          'A challenging Sikkim trek to a close-up viewpoint of Kanchenjunga, the world\u2019s third-highest peak.',
        highlights: ['Kanchenjunga close-up view', 'Sikkim rhododendron forests', 'For experienced trekkers']
      },
      {
        name: 'Triund Trek',
        price: '\u20b93,999',
        duration: '2 Days',
        rating: 4.5,
        description:
          'An easy overnight trek above McLeod Ganj with sunset views over the Dhauladhar range \u2014 ideal for first-timers.',
        highlights: ['Beginner overnight trek', 'Dhauladhar sunset view', 'Close to McLeod Ganj']
      },
      {
        name: 'Rupin Pass Trek',
        price: '\u20b914,999',
        duration: '8 Days',
        rating: 4.8,
        description:
          'A dramatic trail past hanging villages, waterfalls, and a near-vertical snow wall near the pass itself.',
        highlights: ['Hanging village trail', 'Snow wall crossing', 'Himachal\u2013Uttarakhand border route']
      },
      {
        name: 'Brahmatal Trek',
        price: '\u20b99,499',
        duration: '6 Days',
        rating: 4.7,
        description:
          'A winter trek to a frozen alpine lake with views of Trishul and Nanda Ghunti peaks.',
        highlights: ['Frozen alpine lake', 'Trishul peak views', 'Winter snow trekking']
      },
      {
        name: 'Kuari Pass Trek',
        price: '\u20b910,499',
        duration: '6 Days',
        rating: 4.7,
        description:
          'Once scouted as a training route for a British Everest expedition, with wide views across the Garhwal peaks.',
        highlights: ['Historic Everest-expedition route', 'Garhwal peak panorama', 'Moderate difficulty']
      },
      {
        name: 'Sandakphu Trek',
        price: '\u20b911,999',
        duration: '6 Days',
        rating: 4.8,
        description:
          'West Bengal\u2019s highest point, with sunrise views of four of the world\u2019s five highest peaks in a single frame.',
        highlights: ['Four 8000m+ peaks in view', 'West Bengal\u2019s highest point', 'Singalila ridge trail']
      }
    ])
  },

  safari: {
    key: 'safari',
    label: 'Safari Trails',
    shortLabel: 'Safari',
    tagline: 'Wildlife encounters across India and Africa\u2019s best national parks.',
    items: withSlugs([
      {
        name: 'Ranthambore Safari',
        price: '\u20b916,999',
        duration: '3 Days',
        rating: 4.7,
        description:
          'Tiger-tracking jeep safaris through Rajasthan\u2019s most famous national park, with an old fort overlooking the reserve.',
        highlights: ['Tiger-tracking jeep safari', 'Ranthambore Fort visit', 'Two safari sessions included']
      },
      {
        name: 'Jim Corbett Safari',
        price: '\u20b914,499',
        duration: '3 Days',
        rating: 4.6,
        description:
          'India\u2019s oldest national park, home to tigers, elephants and over 600 bird species along the Ramganga river.',
        highlights: ['India\u2019s oldest national park', 'Riverside jungle lodge', 'Bird-watching included']
      },
      {
        name: 'Serengeti Safari, Tanzania',
        price: '\u20b91,89,999',
        duration: '7 Days',
        rating: 4.9,
        description:
          'The Great Migration across the Serengeti plains, staying in tented camps blended into the landscape.',
        highlights: ['Great Migration viewing', 'Luxury tented camps', 'Expert wildlife guides']
      }
    ])
  },

  family: {
    key: 'family',
    label: 'Family Retreat',
    shortLabel: 'Family',
    tagline: 'Easy-paced itineraries built for travelling with kids and grandparents alike.',
    items: withSlugs([
      {
        name: 'Kerala Backwaters Family Trip',
        price: '\u20b922,999',
        duration: '5 Days',
        rating: 4.8,
        description:
          'A slow houseboat cruise through Alleppey\u2019s backwaters, paired with Munnar\u2019s tea gardens \u2014 gentle enough for all ages.',
        highlights: ['Private houseboat stay', 'Munnar tea garden visit', 'Kid-friendly pace']
      },
      {
        name: 'Munnar Family Getaway',
        price: '\u20b918,999',
        duration: '4 Days',
        rating: 4.7,
        description:
          'Cool hill-station weather, tea plantations, and short nature walks that work well for young children.',
        highlights: ['Tea plantation tour', 'Short easy nature walks', 'Cool hill-station climate']
      },
      {
        name: 'Rajasthan Family Circuit',
        price: '\u20b929,999',
        duration: '7 Days',
        rating: 4.8,
        description:
          'Jaipur, Udaipur and Jodhpur\u2019s forts and palaces, with kid-friendly elephant and puppet-show experiences woven in.',
        highlights: ['Jaipur\u2013Udaipur\u2013Jodhpur circuit', 'Elephant & puppet show experiences', 'Family-friendly heritage hotels']
      }
    ])
  },

  luxury: {
    key: 'luxury',
    label: 'Luxury Getaways',
    shortLabel: 'Luxury',
    tagline: 'Private villas, overwater stays, and five-star service for a no-compromise trip.',
    items: withSlugs([
      {
        name: 'Maldives Luxury Retreat',
        price: '\u20b91,45,999',
        duration: '5 Days',
        rating: 4.9,
        description:
          'An overwater villa with a private pool and direct lagoon access, plus a sunset dolphin cruise.',
        highlights: ['Overwater villa with private pool', 'Sunset dolphin cruise', 'All-inclusive dining']
      },
      {
        name: 'Dubai Luxury Escape',
        price: '\u20b998,999',
        duration: '5 Days',
        rating: 4.7,
        description:
          'Burj Khalifa\u2019s top floor, desert glamping under the stars, and a stay at one of Dubai\u2019s landmark five-star hotels.',
        highlights: ['Burj Khalifa top-floor access', 'Desert glamping under the stars', 'Five-star hotel stay']
      },
      {
        name: 'Swiss Alps Luxury Tour',
        price: '\u20b92,49,999',
        duration: '8 Days',
        rating: 4.9,
        description:
          'The Glacier Express by private cabin, mountain-view chalets, and Michelin-recommended dining across Interlaken and Zermatt.',
        highlights: ['Glacier Express private cabin', 'Mountain-view chalet stay', 'Interlaken & Zermatt combo']
      }
    ])
  },

  weekend: {
    key: 'weekend',
    label: 'Weekend Getaways',
    shortLabel: 'Weekend',
    tagline: 'Short, easy trips that fit into a two- or three-day break.',
    items: withSlugs([
      {
        name: 'Rishikesh Weekend',
        price: '\u20b96,999',
        duration: '2 Days',
        rating: 4.6,
        description:
          'River rafting on the Ganga, riverside camping, and the evening Ganga Aarti at Parmarth Niketan.',
        highlights: ['Ganga river rafting', 'Riverside camping', 'Evening Ganga Aarti']
      },
      {
        name: 'Jaipur Weekend',
        price: '\u20b97,999',
        duration: '2 Days',
        rating: 4.7,
        description:
          'Amber Fort, City Palace, and the old city\u2019s bazaars \u2014 an easy heritage trip from most North Indian cities.',
        highlights: ['Amber Fort visit', 'City Palace tour', 'Old city bazaar walk']
      },
      {
        name: 'Lonavala Weekend',
        price: '\u20b95,999',
        duration: '2 Days',
        rating: 4.5,
        description:
          'Monsoon waterfalls, hilltop viewpoints, and cosy resort stays a short drive from Mumbai and Pune.',
        highlights: ['Monsoon waterfall views', 'Hilltop viewpoint stops', 'Short drive from Mumbai/Pune']
      }
    ])
  }
}

export const CATEGORY_LIST = Object.values(CATEGORIES)

export const TRAVELLER_OPTIONS = ['Solo', '2', '3', '4+']

export const CONTACT = {
  phone: '+91 78500 77928',
  phoneHref: 'tel:+917850077928',
  email: 'tripsignatureofficial@gmail.com',
  address: 'D-Block Sheetala Colony, Gurgaon, India'
}