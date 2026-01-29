// ==========================================
// Camikaze Goes Dutch - Lesson Data
// All themes, vocabulary, and exercises
// ==========================================

const THEMES = [
    {
        id: 'horses',
        name: 'Chevaux & Équitation',
        icon: '🐴',
        color: '#8B4513',
        description: 'Le vocabulaire du monde équestre',
        unlocked: true
    },
    {
        id: 'going-out',
        name: 'Sorties & Vie nocturne',
        icon: '🎉',
        color: '#E91E63',
        description: 'Pour sortir et s\'amuser!',
        unlocked: true
    },
    {
        id: 'house',
        name: 'À la maison',
        icon: '🏠',
        color: '#4CAF50',
        description: 'Vocabulaire domestique',
        unlocked: true
    },
    {
        id: 'animals',
        name: 'Animaux',
        icon: '🐱',
        color: '#FF9800',
        description: 'Chats, oies et compagnie',
        unlocked: true
    },
    {
        id: 'music',
        name: 'Musique',
        icon: '🎵',
        color: '#9C27B0',
        description: 'Parle de musique en néerlandais',
        unlocked: true
    },
    {
        id: 'bar-restaurant',
        name: 'Bar & Restaurant',
        icon: '🍺',
        color: '#795548',
        description: 'Commander et socialiser',
        unlocked: true
    },
    {
        id: 'grammar',
        name: 'Grammaire',
        icon: '📝',
        color: '#607D8B',
        description: 'Verbes, articles et structure',
        unlocked: true
    }
];

// Vocabulary per theme (Dutch - French)
const VOCABULARY = {
    horses: [
        { nl: 'het paard', fr: 'le cheval', hint: 'animal' },
        { nl: 'de ruiter', fr: 'le cavalier', hint: 'personne' },
        { nl: 'de amazone', fr: 'la cavalière', hint: 'personne' },
        { nl: 'het zadel', fr: 'la selle', hint: 'équipement' },
        { nl: 'de teugels', fr: 'les rênes', hint: 'équipement' },
        { nl: 'de stal', fr: 'l\'écurie', hint: 'lieu' },
        { nl: 'galopperen', fr: 'galoper', hint: 'verbe' },
        { nl: 'draven', fr: 'trotter', hint: 'verbe' },
        { nl: 'stappen', fr: 'marcher au pas', hint: 'verbe' },
        { nl: 'springen', fr: 'sauter', hint: 'verbe' },
        { nl: 'de hoef', fr: 'le sabot', hint: 'partie du corps' },
        { nl: 'de manen', fr: 'la crinière', hint: 'partie du corps' },
        { nl: 'de staart', fr: 'la queue', hint: 'partie du corps' },
        { nl: 'de manege', fr: 'le manège', hint: 'lieu' },
        { nl: 'het hoefijzer', fr: 'le fer à cheval', hint: 'équipement' },
        { nl: 'de rijles', fr: 'la leçon d\'équitation', hint: 'activité' },
        { nl: 'de hindernis', fr: 'l\'obstacle', hint: 'équipement' },
        { nl: 'de dressuur', fr: 'le dressage', hint: 'discipline' },
        { nl: 'het hooi', fr: 'le foin', hint: 'nourriture' },
        { nl: 'de haver', fr: 'l\'avoine', hint: 'nourriture' }
    ],
    'going-out': [
        { nl: 'uitgaan', fr: 'sortir', hint: 'verbe' },
        { nl: 'de nachtclub', fr: 'la boîte de nuit', hint: 'lieu' },
        { nl: 'dansen', fr: 'danser', hint: 'verbe' },
        { nl: 'de muziek', fr: 'la musique', hint: 'nom' },
        { nl: 'de dj', fr: 'le DJ', hint: 'personne' },
        { nl: 'het feest', fr: 'la fête', hint: 'événement' },
        { nl: 'vieren', fr: 'célébrer', hint: 'verbe' },
        { nl: 'de vriend', fr: 'l\'ami', hint: 'personne' },
        { nl: 'de vriendin', fr: 'l\'amie', hint: 'personne' },
        { nl: 'laat', fr: 'tard', hint: 'adverbe' },
        { nl: 'de dansvloer', fr: 'la piste de danse', hint: 'lieu' },
        { nl: 'de ingang', fr: 'l\'entrée', hint: 'lieu' },
        { nl: 'de uitgang', fr: 'la sortie', hint: 'lieu' },
        { nl: 'de garderobe', fr: 'le vestiaire', hint: 'lieu' },
        { nl: 'gezellig', fr: 'convivial/agréable', hint: 'adjectif' },
        { nl: 'plezier hebben', fr: 's\'amuser', hint: 'expression' },
        { nl: 'de uitnodiging', fr: 'l\'invitation', hint: 'nom' },
        { nl: 'afspreken', fr: 'se donner rendez-vous', hint: 'verbe' },
        { nl: 'de taxi', fr: 'le taxi', hint: 'transport' },
        { nl: 'naar huis gaan', fr: 'rentrer à la maison', hint: 'expression' }
    ],
    house: [
        { nl: 'het huis', fr: 'la maison', hint: 'bâtiment' },
        { nl: 'de keuken', fr: 'la cuisine', hint: 'pièce' },
        { nl: 'de slaapkamer', fr: 'la chambre', hint: 'pièce' },
        { nl: 'de badkamer', fr: 'la salle de bain', hint: 'pièce' },
        { nl: 'de woonkamer', fr: 'le salon', hint: 'pièce' },
        { nl: 'de tuin', fr: 'le jardin', hint: 'extérieur' },
        { nl: 'de tafel', fr: 'la table', hint: 'meuble' },
        { nl: 'de stoel', fr: 'la chaise', hint: 'meuble' },
        { nl: 'het bed', fr: 'le lit', hint: 'meuble' },
        { nl: 'de bank', fr: 'le canapé', hint: 'meuble' },
        { nl: 'de lamp', fr: 'la lampe', hint: 'objet' },
        { nl: 'het raam', fr: 'la fenêtre', hint: 'élément' },
        { nl: 'de deur', fr: 'la porte', hint: 'élément' },
        { nl: 'de trap', fr: 'l\'escalier', hint: 'élément' },
        { nl: 'de koelkast', fr: 'le réfrigérateur', hint: 'appareil' },
        { nl: 'de wasmachine', fr: 'la machine à laver', hint: 'appareil' },
        { nl: 'schoonmaken', fr: 'nettoyer', hint: 'verbe' },
        { nl: 'koken', fr: 'cuisiner', hint: 'verbe' },
        { nl: 'opruimen', fr: 'ranger', hint: 'verbe' },
        { nl: 'de sleutel', fr: 'la clé', hint: 'objet' }
    ],
    animals: [
        { nl: 'de kat', fr: 'le chat', hint: 'animal' },
        { nl: 'de poes', fr: 'la chatte/le minou', hint: 'animal' },
        { nl: 'de hond', fr: 'le chien', hint: 'animal' },
        { nl: 'de gans', fr: 'l\'oie', hint: 'animal' },
        { nl: 'de ganzen', fr: 'les oies', hint: 'pluriel' },
        { nl: 'de vogel', fr: 'l\'oiseau', hint: 'animal' },
        { nl: 'de vis', fr: 'le poisson', hint: 'animal' },
        { nl: 'het konijn', fr: 'le lapin', hint: 'animal' },
        { nl: 'de muis', fr: 'la souris', hint: 'animal' },
        { nl: 'de koe', fr: 'la vache', hint: 'animal' },
        { nl: 'het varken', fr: 'le cochon', hint: 'animal' },
        { nl: 'de kip', fr: 'la poule', hint: 'animal' },
        { nl: 'de eend', fr: 'le canard', hint: 'animal' },
        { nl: 'het huisdier', fr: 'l\'animal de compagnie', hint: 'catégorie' },
        { nl: 'voeren', fr: 'nourrir', hint: 'verbe' },
        { nl: 'aaien', fr: 'caresser', hint: 'verbe' },
        { nl: 'blaffen', fr: 'aboyer', hint: 'verbe' },
        { nl: 'miauwen', fr: 'miauler', hint: 'verbe' },
        { nl: 'spinnen', fr: 'ronronner', hint: 'verbe' },
        { nl: 'de staart', fr: 'la queue', hint: 'partie du corps' }
    ],
    music: [
        { nl: 'de muziek', fr: 'la musique', hint: 'général' },
        { nl: 'het lied', fr: 'la chanson', hint: 'nom' },
        { nl: 'zingen', fr: 'chanter', hint: 'verbe' },
        { nl: 'de zanger', fr: 'le chanteur', hint: 'personne' },
        { nl: 'de zangeres', fr: 'la chanteuse', hint: 'personne' },
        { nl: 'de gitaar', fr: 'la guitare', hint: 'instrument' },
        { nl: 'de piano', fr: 'le piano', hint: 'instrument' },
        { nl: 'de drums', fr: 'la batterie', hint: 'instrument' },
        { nl: 'het concert', fr: 'le concert', hint: 'événement' },
        { nl: 'het festival', fr: 'le festival', hint: 'événement' },
        { nl: 'de band', fr: 'le groupe', hint: 'ensemble' },
        { nl: 'luisteren naar', fr: 'écouter', hint: 'verbe' },
        { nl: 'spelen', fr: 'jouer (d\'un instrument)', hint: 'verbe' },
        { nl: 'de tekst', fr: 'les paroles', hint: 'nom' },
        { nl: 'het ritme', fr: 'le rythme', hint: 'nom' },
        { nl: 'de melodie', fr: 'la mélodie', hint: 'nom' },
        { nl: 'luid', fr: 'fort (volume)', hint: 'adjectif' },
        { nl: 'zacht', fr: 'doux/faible', hint: 'adjectif' },
        { nl: 'het album', fr: 'l\'album', hint: 'nom' },
        { nl: 'de koptelefoon', fr: 'le casque audio', hint: 'objet' }
    ],
    'bar-restaurant': [
        { nl: 'het restaurant', fr: 'le restaurant', hint: 'lieu' },
        { nl: 'het café', fr: 'le café/bar', hint: 'lieu' },
        { nl: 'de bar', fr: 'le bar', hint: 'lieu' },
        { nl: 'het bier', fr: 'la bière', hint: 'boisson' },
        { nl: 'de wijn', fr: 'le vin', hint: 'boisson' },
        { nl: 'het water', fr: 'l\'eau', hint: 'boisson' },
        { nl: 'de koffie', fr: 'le café', hint: 'boisson' },
        { nl: 'de thee', fr: 'le thé', hint: 'boisson' },
        { nl: 'bestellen', fr: 'commander', hint: 'verbe' },
        { nl: 'de rekening', fr: 'l\'addition', hint: 'nom' },
        { nl: 'betalen', fr: 'payer', hint: 'verbe' },
        { nl: 'de ober', fr: 'le serveur', hint: 'personne' },
        { nl: 'de serveerster', fr: 'la serveuse', hint: 'personne' },
        { nl: 'het menu', fr: 'le menu', hint: 'nom' },
        { nl: 'de kaart', fr: 'la carte', hint: 'nom' },
        { nl: 'het voorgerecht', fr: 'l\'entrée', hint: 'plat' },
        { nl: 'het hoofdgerecht', fr: 'le plat principal', hint: 'plat' },
        { nl: 'het nagerecht', fr: 'le dessert', hint: 'plat' },
        { nl: 'lekker', fr: 'délicieux', hint: 'adjectif' },
        { nl: 'proost!', fr: 'santé!', hint: 'expression' }
    ],
    grammar: [
        { nl: 'de/het', fr: 'le/la (articles définis)', hint: 'article' },
        { nl: 'een', fr: 'un/une', hint: 'article' },
        { nl: 'zijn', fr: 'être', hint: 'verbe' },
        { nl: 'hebben', fr: 'avoir', hint: 'verbe' },
        { nl: 'ik', fr: 'je', hint: 'pronom' },
        { nl: 'jij/je', fr: 'tu', hint: 'pronom' },
        { nl: 'hij/zij', fr: 'il/elle', hint: 'pronom' },
        { nl: 'wij/we', fr: 'nous', hint: 'pronom' },
        { nl: 'jullie', fr: 'vous (pluriel)', hint: 'pronom' },
        { nl: 'zij/ze', fr: 'ils/elles', hint: 'pronom' },
        { nl: 'niet', fr: 'ne...pas', hint: 'négation' },
        { nl: 'geen', fr: 'pas de', hint: 'négation' },
        { nl: 'en', fr: 'et', hint: 'conjonction' },
        { nl: 'of', fr: 'ou', hint: 'conjonction' },
        { nl: 'maar', fr: 'mais', hint: 'conjonction' },
        { nl: 'omdat', fr: 'parce que', hint: 'conjonction' },
        { nl: 'wanneer', fr: 'quand', hint: 'adverbe' },
        { nl: 'waar', fr: 'où', hint: 'adverbe' },
        { nl: 'hoe', fr: 'comment', hint: 'adverbe' },
        { nl: 'waarom', fr: 'pourquoi', hint: 'adverbe' }
    ]
};

// Sentences for exercises
const SENTENCES = {
    horses: [
        { nl: 'Ik rijd op een paard.', fr: 'Je monte à cheval.' },
        { nl: 'Het paard galoppeert snel.', fr: 'Le cheval galope vite.' },
        { nl: 'De ruiter draagt een helm.', fr: 'Le cavalier porte un casque.' },
        { nl: 'Het zadel is bruin.', fr: 'La selle est marron.' },
        { nl: 'De paarden staan in de stal.', fr: 'Les chevaux sont dans l\'écurie.' },
        { nl: 'Ik heb een rijles vandaag.', fr: 'J\'ai une leçon d\'équitation aujourd\'hui.' },
        { nl: 'Het paard eet hooi.', fr: 'Le cheval mange du foin.' },
        { nl: 'De manen zijn lang en mooi.', fr: 'La crinière est longue et belle.' },
        { nl: 'Zij springt over de hindernis.', fr: 'Elle saute par-dessus l\'obstacle.' },
        { nl: 'De manege is groot.', fr: 'Le manège est grand.' }
    ],
    'going-out': [
        { nl: 'Wij gaan vanavond uit.', fr: 'Nous sortons ce soir.' },
        { nl: 'Het feest was gezellig.', fr: 'La fête était conviviale.' },
        { nl: 'Ik dans graag op muziek.', fr: 'J\'aime danser sur la musique.' },
        { nl: 'De nachtclub is open tot laat.', fr: 'La boîte de nuit est ouverte tard.' },
        { nl: 'Mijn vrienden komen ook.', fr: 'Mes amis viennent aussi.' },
        { nl: 'We hebben veel plezier gehad.', fr: 'Nous nous sommes bien amusés.' },
        { nl: 'De dj speelt goede muziek.', fr: 'Le DJ joue de la bonne musique.' },
        { nl: 'Waar is de uitgang?', fr: 'Où est la sortie?' },
        { nl: 'Ik neem een taxi naar huis.', fr: 'Je prends un taxi pour rentrer.' },
        { nl: 'Heb je zin om uit te gaan?', fr: 'Tu as envie de sortir?' }
    ],
    house: [
        { nl: 'Het huis heeft drie slaapkamers.', fr: 'La maison a trois chambres.' },
        { nl: 'Ik kook in de keuken.', fr: 'Je cuisine dans la cuisine.' },
        { nl: 'De woonkamer is groot.', fr: 'Le salon est grand.' },
        { nl: 'Doe de deur dicht, alsjeblieft.', fr: 'Ferme la porte, s\'il te plaît.' },
        { nl: 'Het bed is comfortabel.', fr: 'Le lit est confortable.' },
        { nl: 'Ik moet het huis schoonmaken.', fr: 'Je dois nettoyer la maison.' },
        { nl: 'De sleutel ligt op de tafel.', fr: 'La clé est sur la table.' },
        { nl: 'Kijk door het raam.', fr: 'Regarde par la fenêtre.' },
        { nl: 'De tuin is mooi in de zomer.', fr: 'Le jardin est beau en été.' },
        { nl: 'Ik zit op de bank.', fr: 'Je suis assis sur le canapé.' }
    ],
    animals: [
        { nl: 'De kat slaapt op het bed.', fr: 'Le chat dort sur le lit.' },
        { nl: 'Mijn hond is heel lief.', fr: 'Mon chien est très gentil.' },
        { nl: 'De ganzen zwemmen in het meer.', fr: 'Les oies nagent dans le lac.' },
        { nl: 'Ik voer de vis elke dag.', fr: 'Je nourris le poisson chaque jour.' },
        { nl: 'De kat miauwt als hij honger heeft.', fr: 'Le chat miaule quand il a faim.' },
        { nl: 'Het konijn eet wortelen.', fr: 'Le lapin mange des carottes.' },
        { nl: 'De hond blaft naar de postbode.', fr: 'Le chien aboie après le facteur.' },
        { nl: 'Ik aai de poes.', fr: 'Je caresse le chat.' },
        { nl: 'De vogel zingt mooi.', fr: 'L\'oiseau chante joliment.' },
        { nl: 'Heb je een huisdier?', fr: 'As-tu un animal de compagnie?' }
    ],
    music: [
        { nl: 'Ik luister naar muziek.', fr: 'J\'écoute de la musique.' },
        { nl: 'Zij zingt heel mooi.', fr: 'Elle chante très bien.' },
        { nl: 'Hij speelt gitaar.', fr: 'Il joue de la guitare.' },
        { nl: 'Het concert was geweldig.', fr: 'Le concert était génial.' },
        { nl: 'Wat is je favoriete lied?', fr: 'Quelle est ta chanson préférée?' },
        { nl: 'De band speelt vanavond.', fr: 'Le groupe joue ce soir.' },
        { nl: 'De muziek is te luid.', fr: 'La musique est trop forte.' },
        { nl: 'Ik ken de tekst uit mijn hoofd.', fr: 'Je connais les paroles par cœur.' },
        { nl: 'We gaan naar een festival.', fr: 'Nous allons à un festival.' },
        { nl: 'Zet de muziek zachter.', fr: 'Baisse la musique.' }
    ],
    'bar-restaurant': [
        { nl: 'Ik wil graag een biertje.', fr: 'Je voudrais une bière.' },
        { nl: 'Mag ik de rekening?', fr: 'Puis-je avoir l\'addition?' },
        { nl: 'Het eten was lekker.', fr: 'Le repas était délicieux.' },
        { nl: 'Wat wil je drinken?', fr: 'Qu\'est-ce que tu veux boire?' },
        { nl: 'Proost!', fr: 'Santé!' },
        { nl: 'Ik neem het hoofdgerecht.', fr: 'Je prends le plat principal.' },
        { nl: 'De ober is vriendelijk.', fr: 'Le serveur est sympathique.' },
        { nl: 'Kunnen we bestellen?', fr: 'Pouvons-nous commander?' },
        { nl: 'Ik betaal met kaart.', fr: 'Je paie par carte.' },
        { nl: 'Dit café is gezellig.', fr: 'Ce café est convivial.' }
    ],
    grammar: [
        { nl: 'Ik ben blij.', fr: 'Je suis content(e).' },
        { nl: 'Hij heeft een auto.', fr: 'Il a une voiture.' },
        { nl: 'Wij zijn niet thuis.', fr: 'Nous ne sommes pas à la maison.' },
        { nl: 'Zij hebben geen tijd.', fr: 'Ils n\'ont pas de temps.' },
        { nl: 'Ik ga naar school omdat ik moet leren.', fr: 'Je vais à l\'école parce que je dois étudier.' },
        { nl: 'Waar is de trein?', fr: 'Où est le train?' },
        { nl: 'Hoe gaat het met jou?', fr: 'Comment vas-tu?' },
        { nl: 'Wanneer kom je?', fr: 'Quand viens-tu?' },
        { nl: 'Hij eet brood en kaas.', fr: 'Il mange du pain et du fromage.' },
        { nl: 'Wil je koffie of thee?', fr: 'Tu veux du café ou du thé?' }
    ]
};

// Grammar exercises (conjugation, fill-in-the-blank)
const GRAMMAR_EXERCISES = {
    verbConjugation: [
        {
            verb: 'zijn',
            translation: 'être',
            conjugations: {
                'ik': 'ben',
                'jij/je': 'bent',
                'hij/zij/het': 'is',
                'wij/we': 'zijn',
                'jullie': 'zijn',
                'zij/ze': 'zijn'
            }
        },
        {
            verb: 'hebben',
            translation: 'avoir',
            conjugations: {
                'ik': 'heb',
                'jij/je': 'hebt',
                'hij/zij/het': 'heeft',
                'wij/we': 'hebben',
                'jullie': 'hebben',
                'zij/ze': 'hebben'
            }
        },
        {
            verb: 'gaan',
            translation: 'aller',
            conjugations: {
                'ik': 'ga',
                'jij/je': 'gaat',
                'hij/zij/het': 'gaat',
                'wij/we': 'gaan',
                'jullie': 'gaan',
                'zij/ze': 'gaan'
            }
        },
        {
            verb: 'komen',
            translation: 'venir',
            conjugations: {
                'ik': 'kom',
                'jij/je': 'komt',
                'hij/zij/het': 'komt',
                'wij/we': 'komen',
                'jullie': 'komen',
                'zij/ze': 'komen'
            }
        },
        {
            verb: 'werken',
            translation: 'travailler',
            conjugations: {
                'ik': 'werk',
                'jij/je': 'werkt',
                'hij/zij/het': 'werkt',
                'wij/we': 'werken',
                'jullie': 'werken',
                'zij/ze': 'werken'
            }
        }
    ],
    fillInTheBlank: [
        { sentence: 'Ik ___ een kat.', answer: 'heb', hint: 'avoir (ik)' },
        { sentence: 'Hij ___ naar school.', answer: 'gaat', hint: 'aller (hij)' },
        { sentence: 'Wij ___ blij.', answer: 'zijn', hint: 'être (wij)' },
        { sentence: 'Zij ___ Nederlands.', answer: 'spreekt', hint: 'parler (zij)' },
        { sentence: 'Jij ___ mooi.', answer: 'bent', hint: 'être (jij)' },
        { sentence: 'De kat ___ op het bed.', answer: 'slaapt', hint: 'dormir (de kat)' },
        { sentence: 'Ik ___ naar muziek.', answer: 'luister', hint: 'écouter (ik)' },
        { sentence: 'Hij ___ gitaar.', answer: 'speelt', hint: 'jouer (hij)' }
    ]
};

// Word order exercises
const WORD_ORDER = [
    { 
        correct: ['Ik', 'ga', 'naar', 'school'],
        translation: 'Je vais à l\'école'
    },
    { 
        correct: ['Hij', 'eet', 'een', 'appel'],
        translation: 'Il mange une pomme'
    },
    { 
        correct: ['De', 'kat', 'slaapt', 'op', 'het', 'bed'],
        translation: 'Le chat dort sur le lit'
    },
    { 
        correct: ['Wij', 'gaan', 'vanavond', 'uit'],
        translation: 'Nous sortons ce soir'
    },
    { 
        correct: ['Het', 'paard', 'galoppeert', 'snel'],
        translation: 'Le cheval galope vite'
    },
    { 
        correct: ['Ik', 'wil', 'graag', 'een', 'biertje'],
        translation: 'Je voudrais une bière'
    },
    { 
        correct: ['De', 'muziek', 'is', 'te', 'luid'],
        translation: 'La musique est trop forte'
    },
    { 
        correct: ['Mijn', 'hond', 'is', 'heel', 'lief'],
        translation: 'Mon chien est très gentil'
    }
];

// Encouragement messages
const ENCOURAGEMENTS = {
    correct: [
        'Super, Camikaze! 🎉',
        'Geweldig! Tu gères! 💪',
        'Parfait! Continue comme ça! ⭐',
        'Excellent travail! 🌟',
        'Bravo! Tu es en feu! 🔥',
        'Magnifique! 👏',
        'Tu progresses vite! 🚀',
        'Incroyable! 😍',
        'Héél goed! Très bien! 🎊',
        'Tu es une star! ⭐'
    ],
    incorrect: [
        'Pas de souci, on apprend! 💪',
        'Presque! Essaie encore! 🤔',
        'Continue, tu vas y arriver! 🌟',
        'C\'est en faisant des erreurs qu\'on apprend! 📚',
        'Pas grave, l\'important c\'est d\'essayer! 🎯',
        'Tu feras mieux la prochaine fois! 💫'
    ],
    streak: [
        'Tu es en feu! 🔥',
        'Série impressionnante! ⚡',
        'Inarrêtable! 💥',
        'Combo! 🎮'
    ],
    levelUp: [
        'NIVEAU SUPÉRIEUR! 🎉',
        'Tu montes en grade! ⭐',
        'Félicitations, nouveau niveau! 🏆'
    ]
};

// Achievements
const ACHIEVEMENTS = [
    { id: 'first_lesson', icon: '🎯', name: 'Première leçon', description: 'Termine ta première leçon', condition: 'lessonsCompleted >= 1' },
    { id: 'streak_3', icon: '🔥', name: 'En feu!', description: '3 jours de suite', condition: 'streak >= 3' },
    { id: 'streak_7', icon: '🔥', name: 'Semaine parfaite', description: '7 jours de suite', condition: 'streak >= 7' },
    { id: 'xp_100', icon: '💎', name: 'Collectionneur', description: 'Gagne 100 XP', condition: 'totalXP >= 100' },
    { id: 'xp_500', icon: '💎', name: 'Expert', description: 'Gagne 500 XP', condition: 'totalXP >= 500' },
    { id: 'xp_1000', icon: '👑', name: 'Maître', description: 'Gagne 1000 XP', condition: 'totalXP >= 1000' },
    { id: 'perfect_lesson', icon: '✨', name: 'Perfection', description: 'Leçon sans erreur', condition: 'hasPerfectLesson' },
    { id: 'all_themes', icon: '🌈', name: 'Explorateur', description: 'Essaie tous les thèmes', condition: 'themesExplored >= 7' },
    { id: 'horse_master', icon: '🐴', name: 'Écuyer(e)', description: 'Maîtrise le thème chevaux', condition: 'themeProgress.horses >= 100' },
    { id: 'party_animal', icon: '🎉', name: 'Fêtard(e)', description: 'Maîtrise le thème sorties', condition: 'themeProgress.going-out >= 100' },
    { id: 'flashcard_master', icon: '🃏', name: 'Mémoire d\'éléphant', description: '50 cartes mémorisées', condition: 'flashcardsLearned >= 50' },
    { id: 'night_owl', icon: '🦉', name: 'Oiseau de nuit', description: 'Étudie après 22h', condition: 'studiedLateNight' }
];
