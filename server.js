const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const uuidv4 = require('uuid/v4');
const axios = require('axios');
const config = require('./next.config.js');
require('dotenv').config();

const GAE_DEPLOYMENT_ID = process.env.GAE_DEPLOYMENT_ID;
const IS_DEV = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT;
const ACCESS_CONTROL = process.env.ACCESS_CONTROL;
const { charactersURL } = config.publicRuntimeConfig.API;

const characters = {"Batman": "batman", "Bruce Wayne": "batman", "Superman": "superman", "Clark Kent": "superman", "Spider-Man": "spider-man-miles-morales", "Peter Parker": "spider-man", "Captain America": "captain-america", "Steve Rogers": "captain-america", "Wolverine": "wolverine", "Logan": "wolverine", "Iron Man": "iron-man", "Tony Stark": "iron-man", "Wonder Woman": "wonder-woman", "Diana Prince": "wonder-woman", "Lois Lane": "lois-lane", "": "deimos", "Thor": "thor", "Thor Odinson": "thor", "Nightwing": "nightwing", "Dick Grayson": "nightwing", "Thing": "thing", "Ben Grimm": "thing", "Mr. Fantastic": "mr-fantastic", "Reed Richards": "mr-fantastic", "Cyclops": "cyclops", "Scott Summers": "cyclops", "Hulk": "hulk", "Bruce Banner": "hulk", "Commissioner Gordon": "james-gordon", "James Gordon": "james-gordon", "Human Torch": "human-torch-jim-hammond", "Johnny Storm": "human-torch", "Beast": "beast", "Henry McCoy": "beast", "Storm": "storm", "Ororo Munroe": "storm", "Green Lantern": "green-lantern", "Hal Jordan": "green-lantern", "Invisible Woman": "invisible-woman", "Susan Richards": "invisible-woman", "Green Arrow": "green-arrow", "Oliver Queen": "green-arrow", "Aquaman": "aquaman", "Arthur Curry": "aquaman", "Hawkeye": "hawkeye-kate-bishop", "Clint Barton": "hawkeye", "Barbara Gordon": "batgirl", "Oracle / Batgirl": "batgirl", "Martian Manhunter": "martian-manhunter", "J'onn J'onzz": "martian-manhunter", "The Flash": "the-flash", "Wally West": "flash-wally-west", "Doctor Strange": "doctor-strange", "Stephen Strange": "doctor-strange", "Jimmy Olsen": "jimmy-olsen", "Namor": "namor", "Namor Mckenzie": "namor", "Barry Allen": "the-flash", "Iceman": "iceman", "Bobby Drake": "iceman", "Daredevil": "daredevil", "Matthew Murdock": "daredevil", "Jean Grey": "jean-grey", "Phoenix": "jean-grey", "Nick Fury": "nick-fury", "Nicholas Fury": "nick-fury", "Robin": "damian-wayne", "Tim Drake": "robin", "Angel": "angel-warren-worthington-iii", "Mary Jane Watson": "mary-jane-watson", "Professor X": "professor-x", "Charles Xavier": "professor-x", "Lex Luthor": "lex-luthor", "Black Canary": "dinah-drake-lance", "Dinah Laurel Lance": "black-canary", "Colossus": "colossus", "Piotr Rasputin": "colossus", "Nightcrawler": "nightcrawler", "Kurt Wagner": "nightcrawler", "Captain Marvel": "captain-marvel-carol-danvers", "Carol Danvers": "captain-marvel-carol-danvers", "Scarlet Witch": "scarlet-witch", "Wanda Maximoff": "scarlet-witch", "Hank Pym": "hank-pym", "Ant Man": "hank-pym", "Rogue": "rogue", "Anna Marie Raven": "rogue", "Black Widow": "black-widow", "Natalia Romanova": "black-widow", "Wasp": "wasp", "Janet Dyne": "wasp", "Joker": "joker", "Vision": "vision", "Aarkus": "vision", "Kitty Pryde": "kitty-pryde", "J. Jonah Jameson": "j-jonah-jameson", "Punisher": "punisher", "Frank Castle": "punisher", "Doctor Doom": "victor-von-doom", "Victor Von Doom": "victor-von-doom", "She-Hulk": "she-hulk-jennifer-walters", "Jennifer Walters": "she-hulk-jennifer-walters", "Luke Cage": "luke-cage", "Power Man": "luke-cage", "Catwoman": "catwoman", "Selina Kyle": "catwoman", "Cyborg": "cyborg", "Victor Stone": "cyborg", "Alfred Pennyworth": "alfred-pennyworth", "Black Panther": "black-panther", "T'Challa": "black-panther", "Arsenal": "arsenal", "Roy Harper": "arsenal", "Hawkman": "hawkman", "Carter Hall": "hawkman", "Deadpool": "deadpool", "Wade Wilson": "deadpool", "May Parker": "spider-girl-may-parker", "Aunt May": "may-parker", "Emma Frost": "emma-frost", "Magneto": "magneto", "Erik Magnus Eisenhardt/Lehnsherr": "magneto", "Quicksilver": "quicksilver", "Pietro Maximoff": "quicksilver", "Gambit": "gambit", "Remy LeBeau": "gambit", "Spider-Woman": "spider-woman-jessica-drew", "Jessica Drew": "spider-woman-jessica-drew", "Falcon": "falcon", "Sam Wilson": "falcon", "Hawkgirl": "hawkgirl", "Shayera Hol/Kendra Saunders": "hawkgirl", "Starfire": "starfire", "Koriand\u2019r": "starfire", "Power Girl": "power-girl", "Karen Starr": "power-girl", "Atom": "atom", "Ray Palmer": "atom", "Hercules": "hercules", "Herakles, Panhellenios": "hercules", "Supergirl": "supergirl", "Kara Zor-El": "supergirl", "Silver Surfer": "silver-surfer", "Norrin Radd": "silver-surfer", "Iron Fist": "iron-fist-danny-rand", "Danny Rand": "iron-fist-danny-rand", "Beast Boy": "beast-boy", "Garfield Logan": "beast-boy", "Loki": "loki", "Loki Laufeyson": "loki", "Psylocke": "psylocke", "Betsy Braddock": "psylocke", "Harley Quinn": "harley-quinn", "Harleen Quinzel": "harley-quinn", "Winter Soldier": "winter-soldier", "James Bucky Barnes": "winter-soldier", "Cannonball": "cannonball", "Sam Guthrie": "cannonball", "Wonder Man": "wonder-man", "Simon Williams": "wonder-man", "Cable": "cable", "Nathan Summers": "cable", "Edwin Jarvis": "edwin-jarvis", "Norman Osborn": "norman-osborn", "Green Goblin": "norman-osborn", "Flash Thompson": "venom-flash-thompson", "Raven": "raven", "Rachel Roth": "raven", "Constantine": "constantine", "John Constantine": "constantine", "Penguin": "penguin", "Oswald Chesterfield Cobblepot": "penguin", "Iron Patriot": "iron-patriot-james-rhodes", "James Rhodes": "iron-patriot-james-rhodes", "Harvey Bullock": "harvey-bullock", "Sabretooth": "sabretooth", "Victor Creed": "sabretooth", "Dum Dum Dugan": "dum-dum-dugan", "Timothy Aloysius Cadwallader": "dum-dum-dugan", "Poison Ivy": "poison-ivy", "Billy Batson": "shazam", "Franklin Richards": "franklin-richards", "Havok": "havok", "Alex Summers": "havok", "Doctor Octopus": "doctor-octopus", "Otto Octavius": "doctor-octopus", "Superboy": "superboy", "Kon-El": "superboy", "Kingpin": "kingpin", "Wilson Fisk": "kingpin", "Elongated Man": "elongated-man", "Ralph Dibny": "elongated-man", "Zatanna": "zatanna", "Zatanna Zatara": "zatanna", "Jubilee": "jubilee", "Jubilation Lee": "jubilee", "Medusa": "medusa", "Medusa Gorgon": "medusa", "Two-Face": "two-face", "Harvey Dent": "two-face", "Hellcat": "hellcat-patsy-walker", "Patsy Walker": "hellcat-patsy-walker", "Odin": "odin", "Odin Borson": "odin", "Booster Gold": "booster-gold", "Michael Jon Carter": "booster-gold", "Galactus": "galactus", "Galan": "galactus", "Darkseid": "darkseid", "Sunspot": "sunspot", "Roberto  Costa": "sunspot", "Jim Hammond": "human-torch-jim-hammond", "Magik": "magik-illyana-rasputin", "Illyana Rasputin": "magik-illyana-rasputin", "Huntress": "huntress-helena-bertinelli", "Helene Bertinelli": "huntress-helena-bertinelli", "Crystal": "crystal", "Crystalia Maximoff": "crystal", "Blue Beetle": "blue-beetle", "Ted Kord": "ted-kord", "Plastic Man": "plastic-man", "Eel O'Brien": "plastic-man", "Foggy Nelson": "foggy-nelson", "Red Hulk": "red-hulk", "General 'Thunderbolt' Ross": "red-hulk", "Maria Hill": "maria-hill", "Scarecrow": "scarecrow", "Jonathan Crane": "scarecrow", "Rachel Grey": "rachel-grey", "Mystique": "mystique", "Raven Darkholme": "mystique", "Bishop": "bishop", "Lucas Bishop": "bishop", "Killer Croc": "killer-croc", "Waylon Jones": "killer-croc", "Riddler": "riddler", "Edward Nygma": "riddler", "Damian Wayne": "damian-wayne", "Betty Brant": "betty-brant", "Black Bolt": "black-bolt", "Blackagar Boltagon": "black-bolt", "Polaris": "polaris", "Lorna Dane": "polaris", "Moon Knight": "moon-knight", "Marc Spector": "moon-knight", "Wolfsbane": "wolfsbane", "Rahne Sinclair": "wolfsbane", "Dazzler": "dazzler", "Alison Blaire": "dazzler", "Amanda Waller": "amanda-waller", "X-23": "x-23", "Laura Kinney": "x-23", "Ghost Rider": "ghost-rider-daniel-ketch", "Johnny Blaze": "ghost-rider-johnny-blaze", "Betty Ross": "betty-ross", "Mr. Miracle": "mr-miracle", "Scott Free": "mr-miracle", "Uatu The Watcher": "uatu-the-watcher", "Uatu": "uatu-the-watcher", "Red Skull": "red-skull", "Johann Schmidt": "red-skull", "Thanos": "thanos", "Dione": "thanos", "Black Cat": "black-cat", "Felicia Hardy": "black-cat", "Thor (Goddess of Thunder)": "thor-goddess-of-thunder", "Jane Foster": "thor-goddess-of-thunder", "Mockingbird": "mockingbird", "Barbara Morse-Barton": "mockingbird", "Big Barda": "big-barda", "Barda Free": "big-barda", "Gwen Stacy": "gwen-stacy", "Sif": "sif", "Katana": "katana", "Tatsu Yamashiro (山城 タツ)": "katana", "Mr. Terrific": "mr-terrific", "Michael Holt": "mr-terrific", "Monica Rambeau": "monica-rambeau", "Sasquatch": "sasquatch-walter-langkowski", "Walter Langkowski": "sasquatch-walter-langkowski", "Lobo": "lobo", "Nova": "nova-sam-alexander", "Richard Rider": "nova", "Domino": "domino", "Neena Thurman": "domino", "Drax": "drax", "Deadshot": "deadshot", "Floyd Lawton": "deadshot", "Harry Osborn": "harry-osborn", "Ben Urich": "ben-urich", "Eddie Brock": "eddie-brock", "Brainiac": "brainiac", "Vril Dox": "brainiac", "Tigra": "tigra-greer-nelson", "Greer Nelson": "tigra-greer-nelson", "Mera": "mera", "Wong": "wong", "Sinestro": "sinestro", "Thaal Sinestro": "sinestro", "Juggernaut": "juggernaut", "Cain Marko": "juggernaut", "Dani Moonstar": "dani-moonstar", "Captain Britain": "captain-britain", "Brian Braddock": "captain-britain", "Deadman": "deadman", "Boston Brand": "deadman", "Warpath": "warpath", "James Proudstar": "warpath", "Krypto": "krypto", "Superdog": "krypto", "Alicia Masters": "alicia-masters", "Lyja Storm": "alicia-masters", "Gamora": "gamora", "Gamora Whoberi Ben Titan": "gamora", "Vixen": "vixen", "Mari McCabe": "vixen", "Banshee": "banshee-theresa-rourke", "Sean Cassidy": "banshee", "Elektra": "elektra", "Elektra Natchios": "elektra", "Bullseye": "bullseye", "Lester, Benjamin Poindexter": "bullseye", "Sharon Carter": "sharon-carter", "Forge": "forge", "Sandman": "sandman", "William 'Flint Marko' Baker": "sandman", "Mephisto": "mephisto", "Firestar": "firestar", "Angelica Jones": "firestar", "Mr. Freeze": "mr-freeze", "Misty Knight": "misty-knight", "Ra's al Ghul": "ras-al-ghul", "Steve Trevor": "steve-trevor", "Bane": "bane", "Antonio Diego": "bane", "Northstar": "northstar", "Jean-Paul Beaubier": "northstar", "Karnak": "karnak", "Karnak Mander-Azur": "karnak", "Moondragon": "moondragon", "Heather Douglas": "moondragon", "Vindicator": "vindicator", "Heather Hudson": "vindicator", "Moonstone": "moonstone", "Karla Sofen": "moonstone", "Rocket Raccoon": "rocket-raccoon", "Boom Boom": "boom-boom", "Tabitha Smith": "boom-boom", "Lockjaw": "lockjaw", "Daniel Ketch": "ghost-rider-daniel-ketch", "Pepper Potts": "pepper-potts", "Virginia Potts": "pepper-potts", "Captain Boomerang": "captain-boomerang", "George Harkness": "captain-boomerang", "Penance": "penance-robert-baldwin", "Robert Baldwin": "penance-robert-baldwin", "Miles Morales": "spider-man-miles-morales", "Ant-Man": "ant-man-eric-ogrady", "Scott Lang": "ant-man-scott-lang", "Firestorm": "firestorm", "Ronnie Raymond": "firestorm", "Rhino": "rhino", "Aleksei Sytsevich": "rhino", "Puck": "puck", "Eugene Judd": "puck", "Star-Lord": "star-lord-peter-quill", "Peter Quill": "star-lord-peter-quill", "Talia al Ghul": "talia-al-ghul", "Multiple Man": "multiple-man", "Jamie Madrox": "multiple-man", "Captain Cold": "captain-cold", "Leonard Snart": "captain-cold", "Man-Thing": "man-thing", "Theodore Sallis": "man-thing", "Doc Samson": "doc-samson", "Leonard Samson": "doc-samson", "Solomon Grundy": "solomon-grundy", "Cyrus Gold": "solomon-grundy", "Jessica Jones": "jessica-jones", "Alias": "jessica-jones", "Pixie": "pixie", "Megan Gwynn": "pixie", "Dracula": "dracula", "Vlad Tepes": "dracula", "Kang": "kang", "Nathaniel (Kang)": "kang", "Triton": "triton", "Black Adam": "black-adam", "Theo Adam": "black-adam", "Adam Warlock": "adam-warlock", "Blob": "blob", "Frederic J. Dukes": "blob", "Justice": "justice", "Vance Astrovik": "justice", "Vulture": "vulture-adrian-toomes", "Adrian Toomes": "vulture-adrian-toomes", "Quasar": "quasar-phyla-vell", "Wendell Vaughn": "quasar-wendell-vaughn", "Moira MacTaggert": "moira-mactaggert", "Toad": "toad", "Mortimer Toynbee": "toad", "Namorita": "namorita", "Namorita Prentiss": "namorita", "Lockheed": "lockheed", "Apocalypse": "apocalypse", "En Sabah Nur": "apocalypse", "Groot": "groot", "Cloak": "cloak", "Tyrone Johnson": "cloak", "Gorilla Grodd": "gorilla-grodd", "Grodd": "gorilla-grodd", "Nighthawk": "nighthawk", "Kyle Richmond": "nighthawk", "Songbird": "songbird", "Melissa Gold": "songbird", "Ms. Marvel": "ms-marvel-kamala-khan", "Kamala Khan": "ms-marvel-kamala-khan", "Lizard": "lizard", "Curt Connors": "lizard", "Sentry": "sentry-robert-reynolds", "Robert Reynolds": "sentry-robert-reynolds", "Dagger": "dagger", "Tandy Bowen": "dagger", "Sue Dibny": "sue-dibny", "Vandal Savage": "vandal-savage", "Clea": "clea", "Jaime Reyes": "blue-beetle", "Husk": "husk", "Paige Guthrie": "husk", "Strong Guy": "strong-guy", "Guido Carosella": "strong-guy", "Mister Sinister": "mister-sinister", "Nathaniel Essex": "mister-sinister", "Batwoman": "batwoman", "Kate Cane": "batwoman", "Ben Reilly": "spider-man-ben-reilly", "Ka-Zar": "ka-zar", "Kevin Plunder": "ka-zar", "Absorbing Man": "absorbing-man", "Carl Creel": "absorbing-man", "Valeria Richards": "valeria-richards", "Taskmaster": "taskmaster", "Tony Masters": "taskmaster", "Bizarro": "bizarro", "Theresa Rourke-Cassidy": "banshee-theresa-rourke", "M": "m-monet-st-croix", "Monet St. Croix": "m-monet-st-croix", "Lucius Fox": "lucius-fox", "Ares": "ares", "Electro": "electro", "Max Dillon": "electro", "Cheetah": "cheetah", "Barbara Minerva": "cheetah", "Karma": "karma", "Xi'an Manh": "karma", "Blade": "blade", "Eric Brooks": "blade", "Ultron": "ultron", "Amadeus Cho": "amadeus-cho", "Daimon Hellstrom": "daimon-hellstrom", "Chamber": "chamber", "Jonothan Evan Starsmore": "chamber", "Rictor": "rictor", "Julio Richter": "rictor", "MODOK": "m-o-d-o-k", "George Tarleton": "m-o-d-o-k", "Clayface": "clayface", "Magma": "magma-amara-aquilla", "Amara Aquilla": "magma-amara-aquilla", "Sunfire": "sunfire", "Shiro Yoshida": "sunfire", "Kraven the Hunter": "kraven-the-hunter", "Sergei Kravinoff": "kraven-the-hunter", "Baron Zemo": "baron-zemo-heinrich-zemo", "Helmet Zemo": "baron-zemo-heinrich-zemo", "Mar-Vell": "captain-marvel-mar-vell", "Aurora": "aurora", "Jeanne-Marie Beaubier": "aurora", "Sersi": "sersi", "Gladiator": "gladiator-kallark", "Kallark": "gladiator-kallark", "Scarlet Spider": "scarlet-spider-kaine", "Kaine Parker": "scarlet-spider-kaine", "Daken": "daken", "Daken Akihiro": "daken", "Rawhide Kid": "rawhide-kid", "Johnny Bart": "rawhide-kid", "Carnage": "carnage", "Cletus Kasady": "carnage", "Starfox": "starfox", "Eros": "starfox", "Celeste Cuckoo": "celeste-cuckoo", "Stepford Cuckoo": "sophie-cuckoo", "Sam Alexander": "nova-sam-alexander", "Deathstroke": "deathstroke", "Slade Wilson": "deathstroke", "Shaman": "shaman", "Michael Twoyoungmen": "shaman", "Longshot": "longshot", "Karen Page": "karen-page", "Morbius": "morbius", "Mole Man": "mole-man", "Harvey Elder": "mole-man", "Kate Bishop": "hawkeye-kate-bishop", "Werewolf By Night": "werewolf-by-night", "Jacob Russell": "werewolf-by-night", "Shatterstar": "shatterstar", "Gaveedra-Seven": "shatterstar", "Enchantress": "enchantress", "June Moone": "enchantress", "Irma (Mindee) Cuckoo": "irma-cuckoo", "Hope Summers": "hope-summers", "Sebastian Shaw": "sebastian-shaw", "Phoebe Cuckoo": "phoebe-cuckoo", "Howard The Duck": "howard-the-duck", "Howard": "howard-the-duck", "Stature": "stature", "Cassandra Eleanor Lang": "stature", "High Evolutionary": "high-evolutionary", "Herbert Wyndham": "high-evolutionary", "Spider-Girl": "spider-girl-anya-corazon", "Leader": "leader", "Samuel Sterns": "leader", "Jocasta": "jocasta", "Jocasta Pym": "jocasta", "Shocker": "shocker-herman-schultz", "Herman Schultz": "shocker-herman-schultz", "Boomerang": "boomerang", "Fred Myers": "boomerang", "Black Manta": "black-manta", "David Hyde": "black-manta", "Mysterio": "mysterio", "Quentin Beck": "mysterio", "Lightspeed": "lightspeed", "Julie Power": "lightspeed", "Crossbones": "crossbones", "Brock Rumlow": "crossbones", "Lady Deathstrike": "lady-deathstrike", "Yuriko Oyama": "lady-deathstrike", "Machine Man": "machine-man", "Aaron Stack": "machine-man", "Namora": "namora", "Aquaria Neptunia": "namora", "Quentin Quire": "quentin-quire", "Kid Omega": "quentin-quire", "Lilandra": "lilandra", "Lilandra Neramani": "lilandra", "Zod": "zod", "Dru-Zod": "zod", "Mr. Hyde": "mr-hyde", "Calvin Zabo": "mr-hyde", "Squirrel Girl": "squirrel-girl", "Doreen Green": "squirrel-girl", "Viper": "viper", "Ophelia Sarkissian": "viper", "Colleen Wing": "colleen-wing", "Wiccan": "wiccan", "Billy Kaplan": "wiccan", "Diamondback": "diamondback-rachel-leighton", "Rachel Leighton": "diamondback-rachel-leighton", "Chameleon": "chameleon", "Dmitri Smerdyakov Kravinoff": "chameleon", "Mantis": "mantis", "Mandy Celestine": "mantis", "Dormammu": "dormammu", "Ronan": "ronan", "Ronan The Accuser": "ronan", "Swamp Thing": "swamp-thing", "Alec Holland": "swamp-thing", "Mad Thinker": "mad-thinker", "Julius": "mad-thinker", "Hammerhead": "hammerhead", "Maggia Boss": "hammerhead", "Abomination": "abomination-emil-blonsky", "Emil Blonsky": "abomination-emil-blonsky", "Klaw": "klaw", "Ulysses Klaw": "klaw", "X-Man": "x-man", "Nate Grey": "x-man", "Doomsday": "doomsday", "Mandarin": "mandarin", "Kahn": "mandarin", "Silver Sable": "silver-sable", "Silver Sablinova": "silver-sable", "Shanna the She-Devil": "shanna-the-she-devil", "Shanna O'Hara Plunder": "shanna-the-she-devil", "Guardian": "guardian", "James Hudson": "guardian", "Rage": "rage", "Elvin Haliday": "rage", "Wild Child": "wild-child", "Kyle Gibney": "wild-child", "Nightmare": "nightmare", "Pyro": "pyro", "St. John Allerdyce": "pyro", "Anya Corazon": "spider-girl-anya-corazon", "Annihilus": "annihilus", "Super-Skrull": "super-skrull", "Kl'rt": "super-skrull", "Bastion": "bastion", "Nimrod": "bastion", "Radioactive Man": "radioactive-man", "Chen Lu": "radioactive-man", "Dinah Drake-Lance": "dinah-drake-lance", "Blink": "blink", "Clarice Ferguson": "blink", "Caliban": "caliban", "Snowbird": "snowbird", "Narya Easton": "snowbird", "Dragon Man": "dragon-man", "Batroc the Leaper": "batroc-the-leaper", "Georges Batroc": "batroc-the-leaper", "Madame Masque": "madame-masque", "Giulietta Kristina Nefaria": "madame-masque", "Stingray": "stingray-walter-newell", "Dr. Newell": "stingray-walter-newell", "Tombstone": "tombstone", "Lonnie Lincoln": "tombstone", "Doop": "doop", "Genis-Vell": "captain-marvel-genis-vell", "Marvel Boy": "marvel-boy", "Noh-Varr": "marvel-boy", "Constrictor": "constrictor", "Frank Schlichting": "constrictor", "Avalanche": "avalanche", "Dominic 'Petros' Szilard": "avalanche", "Callisto": "callisto", "Quake": "quake-daisy-johnson", "Daisy Johnson": "quake-daisy-johnson", "Arcade": "arcade", "Firelord": "firelord", "Pyreus Kril": "firelord", "Typhoid Mary": "typhoid-mary", "Mary Walker": "typhoid-mary", "Sauron": "sauron", "Karl Lykos": "sauron", "Whirlwind": "whirlwind", "David Cannon": "whirlwind", "Devil Dinosaur": "devil-dinosaur", "Marrow": "marrow", "Sarah": "marrow", "Mastermind": "mastermind", "Jason Wyngarde": "mastermind", "Mimic": "mimic", "Calvin Rankin": "mimic", "Pandora": "pandora", "Jackal": "jackal", "Miles Warren": "jackal", "Corsair": "corsair", "Christopher Summers": "corsair", "Hobgoblin": "hobgoblin-roderick-kingsley", "Roderick Kingsley": "hobgoblin-roderick-kingsley", "Patriot": "patriot", "Jeffrey Mace": "patriot", "Omega Red": "omega-red", "Arkady Rossovich": "omega-red", "Rick Flag": "rick-flag", "Starhawk": "starhawk-stakar-ogord", "Stakar Ogord": "starhawk-stakar-ogord", "Hepzibah": "hepzibah", "Spiral": "spiral-rita-wayword", "Rita Wayword": "spiral-rita-wayword", "Sin": "sin", "Synthia Shmidt": "sin", "Ch'od": "chod", "Grey Gargoyle": "grey-gargoyle", "Paul Duval": "grey-gargoyle", "Fin Fang Foom": "fin-fang-foom", "Layla Miller": "layla-miller", "Raza": "raza", "Raza Longknife": "raza", "Atrocitus": "atrocitus", "Atros": "atrocitus", "Ulik": "ulik", "Puppet Master": "puppet-master", "Phillip Masters": "puppet-master", "Satana": "satana", "Satana Hellstrom": "satana", "Selene": "selene", "Selene Gallio": "selene", "Carlie Cooper": "carlie-cooper", "Silver Samurai": "silver-samurai", "Kenuichio Harada": "silver-samurai", "Mojo": "mojo", "Anti-Monitor": "anti-monitor", "Mobius": "anti-monitor", "Miss America": "miss-america", "Madeline Joyce": "miss-america", "Legion": "legion", "David Haller": "legion", "Swordsman": "swordsman", "Jacques Duquesne": "swordsman", "Blastaar": "blastaar", "Triathlon": "triathlon", "Delroy Garrett, Jr.": "triathlon", "Madelyne Pryor": "madelyne-pryor", "Nocturne": "nocturne", "Talia Wagner": "nocturne", "Grim Reaper": "grim-reaper", "Eric Williams": "grim-reaper", "Destiny": "destiny", "Irene Adler": "destiny", "Eric O'Grady": "ant-man-eric-ogrady", "Prowler": "prowler", "Hobie Brown": "prowler", "Vengeance": "vengeance-michael-badilino", "Michael Badilino.": "vengeance-michael-badilino", "Echo": "echo", "Maya Lopez": "echo", "Mesmero": "mesmero", "Vincent": "mesmero", "Reptil": "reptil", "Humberto Lopez": "reptil", "Thunderbird": "thunderbird-neal-shaara", "John Proudstar": "thunderbird-john-proudstar", "Deathbird": "deathbird", "Cal'syee Neramani": "deathbird", "Elsa Bloodstone": "elsa-bloodstone", "Gateway": "gateway", "Diablo": "diablo", "Esteban Corazon Ablo": "diablo", "Firebird": "firebird", "Bonita Juarez": "firebird", "Steppenwolf": "steppenwolf", "Midnighter": "midnighter", "Lucas Trent": "midnighter", "Slapstick": "slapstick", "Steve Jones Harmon": "slapstick", "Phyla-Vell": "quasar-phyla-vell", "Killer Frost": "killer-frost", "Caitlin Snow": "killer-frost", "Zoom": "zoom", "Hunter Zolomon": "zoom", "Count Nefaria": "count-nefaria", "Luchino Nefaria": "count-nefaria", "Anarky": "anarky", "Lonnie Machin": "anarky", "Killraven": "killraven", "Jonathan Raven": "killraven", "Gorgon": "gorgon", "Tomi Shishido": "gorgon", "White Tiger": "white-tiger-angela-del-toro", "Angela Toro": "white-tiger-angela-del-toro", "Joseph": "joseph", "Neal Shaara": "thunderbird-neal-shaara", "El Diablo": "el-diablo", "Chato Santana": "el-diablo", "Gauntlet": "gauntlet-joseph-green", "Joseph Green": "gauntlet-joseph-green", "Amethyst": "amethyst", "Amy Winston": "amethyst", "Stacy X": "stacy-x", "Miranda Leevald": "stacy-x", "Rick Jones": "rick-jones", "Fantomex": "fantomex", "Jean-Phillipe": "fantomex", "Esme Cuckoo": "esme-cuckoo", "Heat Wave": "heat-wave", "Mick Rory": "heat-wave", "Sophie Cuckoo": "sophie-cuckoo", "Excalibur": "excalibur", "Faiza Hussain": "excalibur", "Reverse-Flash": "reverse-flash", "Daniel West": "reverse-flash", "Telos": "telos", "Shang-Chi": "shang-chi", "Deimos": "deimos", "Darkhawk": "darkhawk", "Chris Powell": "darkhawk", "Stryfe": "stryfe", "Cable clone": "stryfe"}


const search = async (query) => {
    query = query?.toLowerCase() || '';
    const response = {
      meta: {
        status_code: 200,
        error: null,
        pagination: null,
      },
      data: [],
    }
    if (!query || query.length < 2) {
        return response;
    }

    const requests = [];
    for (const key of Object.keys(characters)) {
        const name = key.toLowerCase()
        const slug = characters[key]
        if (!requests.includes(slug) && name.startsWith(query)) {
          requests.push(axios.get(`${charactersURL}/${slug}`));
        }
    }

   return Promise.all(requests).then((responses) => {
    return responses.map((response) => {
      const data = response.data;
      const  {publisher, name, other_name, description, vendor_url, vendor_description, slug, thumbnails } = data.data;            
      return {
        publisher,
        name,
        other_name,
        description,
        vendor_url,
        vendor_description,
        slug,
        thumbnails
      }
    })
  })
}


const app = next({ dev: IS_DEV });
const handle = app.getRequestHandler();
const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'node' },
  transports: new winston.transports.Console({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.align()),
  }),
});

const secureCookieOpts = {
  secure: !IS_DEV,
  sameSite: 'strict',
};

const UUIDMiddleware = (req, res, next) => {
  if (!req.cookies.cc_visitor_id) {
    res.cookie('cc_visitor_id', uuidv4(), secureCookieOpts);
  }
  next();
};

const HTTPSRedirect = (req, res, next) => {
  if (!IS_DEV && !req.secure) {
    res.redirect('https://' + req.hostname + req.originalUrl);
  } else {
    next();
  }
};

const NonWWWRedirect = (req, res, next) => {
  const host = req.header('host');
  if (host.slice(0, 4) === 'www.') {
    return res.redirect(301, req.protocol + '://' + host.slice(4) + req.originalUrl);
  } 
  next();
};

app
  .prepare()
  .then(() => {
    const server = express();
    if (GAE_DEPLOYMENT_ID) {
      // Redirect http to https if not secure since we are using GAE standard plan.
      server.use(HTTPSRedirect);
      // Redirect www to non-www since we are using GAE standard.
      server.use(NonWWWRedirect);
    }
    server.use(cookieParser());
    server.disable('x-powered-by');
    server.use(UUIDMiddleware);
    server.set('trust proxy', true);

    server.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'sameorigin');
      res.setHeader('Referrer-Policy', 'origin');
      res.setHeader('x-xss-protection', '1; mode=block');
      res.setHeader('Access-Control-Allow-Origin', ACCESS_CONTROL);
      if (GAE_DEPLOYMENT_ID) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        res.setHeader('Vary', 'Origin');
      }
      next();
    });

    server.get('/marvel', (req, res) => {
      // `/marvel` is the filename of `/pages/marvel.js
      // * must pass in req.params for back button to work:
      // https://github.com/zeit/next.js/issues/3065#issuecomment-423035872
      app.render(req, res, '/marvel', req.params);
    });

    server.get('/dc', (req, res) => {
      app.render(req, res, '/dc', req.params);
    });

    server.get('/characters/:slug', (req, res) => {
      app.render(req, res, '/characters', req.params);
    });

    server.get('/faq', (req, res) => {
      app.render(req, res, '/faq', req.params);
    });

    server.get('/search', (req, res) => {
      const response = {
        meta: {
          status_code: 200,
          error: null,
          pagination: null,
        },
        data: [],
      };
      res.setHeader('Content-Type', 'application/json');
      const query = req.query['query'];
      if (!query || query.length < 2) {
        return res.json(response);
      }
      return search(query).then((results) => {
        return res.json({
          ...response,
          data: results,
        })
      }).catch((error) => {
        logger.error(`Error searching for ${query}: ${JSON.stringify(error)}`);
        const status_code = error?.meta?.status_code || 500;
        response.meta.status_code = status_code;
        response.meta.error = error?.meta?.error || error.message;
        return res.status(status_code).send(response);
      })
    })

    server.get('/', (req, res) => {
      // `/index` is the filename of `/pages/index.js
      // * must pass in req.params for back button to work:
      // https://github.com/zeit/next.js/issues/3065#issuecomment-423035872
      app.render(req, res, '/', req.params);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) {
        throw err;
      }
      if (GAE_DEPLOYMENT_ID) {
        const GAE_INSTANCE = process.env.GAE_INSTANCE;
        const GAE_MEMORY_MB = process.env.GAE_MEMORY_MB;
        logger.info(
          `started application for ` +
            `GAE_DEPLOYMENT_ID: ${GAE_DEPLOYMENT_ID}, GAE_INSTANCE: ${GAE_INSTANCE}, GAE_MEMORY_MB: ${GAE_MEMORY_MB}`
        );
      }
      logger.info(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch((ex) => {
    logger.error(ex.stack);
    process.exit(1);
  });
