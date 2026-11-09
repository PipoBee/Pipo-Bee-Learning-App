export type DifficultyTier = 'easy' | 'medium' | 'advanced';

export interface AlphabetWord {
  word: string;
  emoji: string;
}

export interface AlphabetEntry {
  letter: string;
  sound: string;
  easyWords: AlphabetWord[];
  mediumWords: AlphabetWord[];
  advancedWords: AlphabetWord[];
}

const w = (word: string, emoji: string): AlphabetWord => ({ word, emoji });

export const ALPHABET: AlphabetEntry[] = [
  {
    letter: 'a',
    sound: 'aa',
    easyWords: [
      w('ant', '🐜'), w('axe', '🪓'), w('ape', '🦧'), w('arm', '💪'), w('ash', '🌋'),
      w('act', '🎭'), w('add', '➕'), w('air', '💨'), w('aid', '🩹'), w('age', '🎂'),
    ],
    mediumWords: [
      w('apple', '🍎'), w('acorn', '🌰'), w('arrow', '🏹'), w('alarm', '⏰'), w('angel', '👼'),
      w('apron', '🥼'), w('amber', '🟡'), w('alley', '🎳'), w('atlas', '🗺️'), w('alien', '👽'),
    ],
    advancedWords: [
      w('anchor', '⚓'), w('astronaut', '👨‍🚀'), w('alligator', '🐊'), w('alphabet', '🔤'), w('avocado', '🥑'),
      w('acrobat', '🤸'), w('apricot', '🍑'), w('actress', '🎬'), w('athlete', '🏃'), w('animals', '🐾'),
    ],
  },
  {
    letter: 'b',
    sound: 'b',
    easyWords: [
      w('bat', '🦇'), w('bag', '🎒'), w('bed', '🛏️'), w('bin', '🗑️'), w('box', '📦'),
      w('bug', '🐛'), w('bus', '🚌'), w('bun', '🥖'), w('boy', '👦'), w('bow', '🎀'),
    ],
    mediumWords: [
      w('ball', '⚽'), w('bird', '🐦'), w('blue', '🔵'), w('boat', '⛵'), w('book', '📖'),
      w('boot', '👢'), w('bell', '🔔'), w('bark', '🐕'), w('barn', '🚜'), w('bear', '🐻'),
    ],
    advancedWords: [
      w('banana', '🍌'), w('basket', '🧺'), w('butter', '🧈'), w('button', '🔘'), w('balloon', '🎈'),
      w('blanket', '🛋️'), w('bridge', '🌉'), w('beetle', '🪲'), w('brother', '🧒'), w('bottle', '🍼'),
    ],
  },
  {
    letter: 'c',
    sound: 'k',
    easyWords: [
      w('cat', '🐱'), w('can', '🥫'), w('cap', '🧢'), w('cup', '☕'), w('cow', '🐮'),
      w('car', '🚗'), w('cot', '🛏️'), w('cub', '🐻'), w('cry', '😢'), w('cut', '✂️'),
    ],
    mediumWords: [
      w('cake', '🎂'), w('camp', '⛺'), w('card', '🃏'), w('cold', '🥶'), w('corn', '🌽'),
      w('crab', '🦀'), w('crow', '🐦‍⬛'), w('clip', '📎'), w('coat', '🧥'), w('clown', '🤡'),
    ],
    advancedWords: [
      w('candle', '🕯️'), w('camera', '📷'), w('castle', '🏰'), w('cookie', '🍪'), w('carrot', '🥕'),
      w('caterpillar', '🐛'), w('coconut', '🥥'), w('circus', '🎪'), w('crayon', '🖍️'), w('cricket', '🦗'),
    ],
  },
  {
    letter: 'd',
    sound: 'd',
    easyWords: [
      w('dad', '👨'), w('dog', '🐶'), w('dig', '⛏️'), w('dot', '🔴'), w('dip', '🥣'),
      w('den', '🦁'), w('dam', '🦫'), w('day', '☀️'), w('dry', '🏜️'), w('dew', '💧'),
    ],
    mediumWords: [
      w('duck', '🦆'), w('drum', '🥁'), w('door', '🚪'), w('desk', '🪑'), w('dark', '🌑'),
      w('deer', '🦌'), w('dive', '🤿'), w('drop', '💧'), w('doll', '🪆'), w('dirt', '🪴'),
    ],
    advancedWords: [
      w('dolphin', '🐬'), w('dragon', '🐉'), w('dinosaur', '🦖'), w('dentist', '🦷'), w('doctor', '🩺'),
      w('diamond', '💎'), w('donkey', '🫏'), w('dinner', '🍽️'), w('dancer', '💃'), w('daisy', '🌼'),
    ],
  },
  {
    letter: 'e',
    sound: 'eh',
    easyWords: [
      w('egg', '🥚'), w('elf', '🧝'), w('elk', '🦌'), w('ear', '👂'), w('eye', '👁️'),
      w('end', '🏁'), w('eat', '🍽️'), w('emu', '🦤'), w('era', '⏳'), w('ebb', '🌊'),
    ],
    mediumWords: [
      w('eagle', '🦅'), w('empty', '📭'), w('enter', '🚪'), w('earth', '🌍'), w('elbow', '💪'),
      w('eight', '8️⃣'), w('every', '👥'), w('entry', '🎟️'), w('event', '🎉'), w('extra', '⭐'),
    ],
    advancedWords: [
      w('elephant', '🐘'), w('engine', '🚂'), w('emerald', '💚'), w('explore', '🧭'), w('energy', '⚡'),
      w('envelope', '✉️'), w('escalator', '🪜'), w('eclipse', '🌘'), w('exercise', '🏋️'), w('element', '🧪'),
    ],
  },
  {
    letter: 'f',
    sound: 'fff',
    easyWords: [
      w('fan', '🪭'), w('fox', '🦊'), w('fat', '🐖'), w('fin', '🦈'), w('fit', '🏃'),
      w('fog', '🌫️'), w('fun', '🥳'), w('fly', '🪰'), w('few', '🤏'), w('fur', '🐈'),
    ],
    mediumWords: [
      w('fish', '🐟'), w('frog', '🐸'), w('flag', '🚩'), w('fire', '🔥'), w('foot', '🦶'),
      w('fork', '🍴'), w('farm', '🚜'), w('fast', '⚡'), w('four', '4️⃣'), w('five', '5️⃣'),
    ],
    advancedWords: [
      w('feather', '🪶'), w('flamingo', '🦩'), w('flower', '🌸'), w('forest', '🌲'), w('farmer', '🧑‍🌾'),
      w('finger', '☝️'), w('flute', '🪈'), w('factory', '🏭'), w('freeze', '🧊'), w('football', '🏈'),
    ],
  },
  {
    letter: 'g',
    sound: 'g',
    easyWords: [
      w('gas', '⛽'), w('gap', '🕳️'), w('gem', '💎'), w('get', '🎁'), w('gum', '🍬'),
      w('god', '👑'), w('gut', '🫀'), w('guy', '🧑'), w('gym', '🏋️'), w('gun', '🔫'),
    ],
    mediumWords: [
      w('goat', '🐐'), w('gold', '🪙'), w('girl', '👧'), w('gate', '⛩️'), w('gift', '🎁'),
      w('game', '🎮'), w('golf', '⛳'), w('grow', '🌱'), w('gray', '🩶'), w('glow', '💡'),
    ],
    advancedWords: [
      w('giraffe', '🦒'), w('garden', '🏡'), w('guitar', '🎸'), w('gorilla', '🦍'), w('glasses', '👓'),
      w('grapes', '🍇'), w('gloves', '🧤'), w('glider', '🪂'), w('garlic', '🧄'), w('giant', '🗿'),
    ],
  },
  {
    letter: 'h',
    sound: 'h',
    easyWords: [
      w('hat', '🎩'), w('hen', '🐔'), w('ham', '🍖'), w('hot', '🌶️'), w('hug', '🫂'),
      w('hop', '🦘'), w('hut', '🛖'), w('hay', '🌾'), w('him', '👦'), w('her', '👧'),
    ],
    mediumWords: [
      w('hand', '✋'), w('hill', '⛰️'), w('home', '🏠'), w('horn', '📯'), w('hair', '💇'),
      w('hawk', '🦅'), w('hook', '🪝'), w('hole', '🕳️'), w('help', '🆘'), w('hard', '🪨'),
    ],
    advancedWords: [
      w('helicopter', '🚁'), w('helmet', '⛑️'), w('hippo', '🦛'), w('hamster', '🐹'), w('honey', '🍯'),
      w('hammer', '🔨'), w('hospital', '🏥'), w('harvest', '🌽'), w('holiday', '🏖️'), w('hanger', '🪝'),
    ],
  },
  {
    letter: 'i',
    sound: 'ih',
    easyWords: [
      w('ink', '🖋️'), w('ice', '🧊'), w('ill', '🤒'), w('inn', '🏨'), w('ivy', '🌿'),
      w('ion', '⚛️'), w('its', '🏷️'), w('ire', '😠'), w('irk', '😤'), w('ilk', '👥'),
    ],
    mediumWords: [
      w('igloo', '🧊'), w('iron', '🧲'), w('item', '📦'), w('itch', '🦟'), w('inch', '📏'),
      w('idea', '💡'), w('icon', '🖼️'), w('into', '➡️'), w('isle', '🏝️'), w('iris', '👁️'),
    ],
    advancedWords: [
      w('iguana', '🦎'), w('island', '🏝️'), w('insect', '🐜'), w('invite', '💌'), w('invent', '🔬'),
      w('inside', '📦'), w('infant', '👶'), w('icicle', '🧊'), w('instrument', '🎺'), w('impact', '💥'),
    ],
  },
  {
    letter: 'j',
    sound: 'j',
    easyWords: [
      w('jam', '🍓'), w('jar', '🫙'), w('jet', '✈️'), w('jog', '🏃'), w('jug', '🫖'),
      w('jaw', '🦷'), w('joy', '😃'), w('job', '💼'), w('jig', '💃'), w('jot', '✍️'),
    ],
    mediumWords: [
      w('jump', '🦘'), w('jeep', '🚙'), w('joke', '😂'), w('june', '📅'), w('july', '☀️'),
      w('join', '🤝'), w('junk', '🗑️'), w('jade', '🟢'), w('jail', '🏛️'), w('jazz', '🎷'),
    ],
    advancedWords: [
      w('jellyfish', '🪼'), w('jacket', '🧥'), w('jungle', '🌴'), w('jumper', '🦘'), w('jaguar', '🐆'),
      w('jester', '🃏'), w('journal', '📓'), w('jigsaw', '🧩'), w('journey', '🗺️'), w('jewel', '💎'),
    ],
  },
  {
    letter: 'k',
    sound: 'k',
    easyWords: [
      w('key', '🔑'), w('kid', '🧒'), w('kit', '🧰'), w('keg', '🛢️'), w('kin', '👨‍👩‍👧'),
      w('kip', '🛌'), w('ken', '👁️'), w('koi', '🐟'), w('kat', '🐱'), w('kay', '🛶'),
    ],
    mediumWords: [
      w('kite', '🪁'), w('king', '👑'), w('kiss', '💋'), w('knee', '🦵'), w('kick', '⚽'),
      w('keep', '📥'), w('knot', '🪢'), w('kettle', '🫖'), w('kale', '🥬'), w('kiwi', '🥝'),
    ],
    advancedWords: [
      w('kangaroo', '🦘'), w('kitchen', '🧑‍🍳'), w('koala', '🐨'), w('kitten', '🐱'), w('keyboard', '⌨️'),
      w('ketchup', '🍅'), w('kayak', '🛶'), w('knitting', '🧶'), w('kingdom', '🏰'), w('kumquat', '🍊'),
    ],
  },
  {
    letter: 'l',
    sound: 'lll',
    easyWords: [
      w('leg', '🦵'), w('lip', '👄'), w('log', '🪵'), w('lid', '🫙'), w('lap', '🏃'),
      w('low', '⬇️'), w('let', '🚪'), w('lit', '🕯️'), w('lay', '🛏️'), w('lad', '👦'),
    ],
    mediumWords: [
      w('lion', '🦁'), w('lamp', '🛋️'), w('leaf', '🍃'), w('lake', '🏞️'), w('lock', '🔒'),
      w('lamb', '🐑'), w('line', '📏'), w('lime', '🍋'), w('luck', '🍀'), w('loud', '📢'),
    ],
    advancedWords: [
      w('ladybug', '🐞'), w('lemon', '🍋'), w('ladder', '🪜'), w('lizard', '🦎'), w('lighthouse', '🗼'),
      w('lobster', '🦞'), w('letter', '✉️'), w('lantern', '🏮'), w('library', '📚'), w('leopard', '🐆'),
    ],
  },
  {
    letter: 'm',
    sound: 'mmm',
    easyWords: [
      w('mat', '🧘'), w('map', '🗺️'), w('man', '👨'), w('mud', '🪴'), w('mop', '🧹'),
      w('mug', '☕'), w('men', '👥'), w('mix', '🥣'), w('mom', '👩'), w('meow', '🐱'),
    ],
    mediumWords: [
      w('moon', '🌙'), w('milk', '🥛'), w('mask', '🎭'), w('mole', '🦔'), w('maze', '🌀'),
      w('mouse', '🐭'), w('moth', '🦋'), w('meat', '🥩'), w('mail', '📬'), w('mint', '🌿'),
    ],
    advancedWords: [
      w('monkey', '🐒'), w('magnet', '🧲'), w('monster', '👾'), w('muffin', '🧁'), w('market', '🛒'),
      w('mushroom', '🍄'), w('melon', '🍈'), w('mirror', '🪞'), w('mittens', '🧤'), w('morning', '🌅'),
    ],
  },
  {
    letter: 'n',
    sound: 'nnn',
    easyWords: [
      w('nut', '🥜'), w('net', '🥅'), w('nap', '😴'), w('nod', '🙇'), w('new', '✨'),
      w('now', '⏰'), w('not', '🚫'), w('nip', '🤏'), w('nib', '✒️'), w('nil', '0️⃣'),
    ],
    mediumWords: [
      w('nest', '🪺'), w('nose', '👃'), w('nine', '9️⃣'), w('neck', '🧣'), w('nail', '💅'),
      w('note', '📝'), w('noon', '🕛'), w('name', '🏷️'), w('near', '📍'), w('neat', '🧹'),
    ],
    advancedWords: [
      w('necklace', '📿'), w('napkin', '🧻'), w('needle', '🪡'), w('nurse', '👩‍⚕️'), w('noodle', '🍜'),
      w('night', '🌃'), w('ninja', '🥷'), w('nature', '🌲'), w('number', '🔢'), w('newt', '🦎'),
    ],
  },
  {
    letter: 'o',
    sound: 'o',
    easyWords: [
      w('owl', '🦉'), w('oak', '🌳'), w('oar', '🚣'), w('oil', '🛢️'), w('old', '👴'),
      w('one', '1️⃣'), w('our', '👥'), w('out', '🚪'), w('off', '📴'), w('oxen', '🐂'),
    ],
    mediumWords: [
      w('otter', '🦦'), w('open', '📂'), w('oven', '🍳'), w('onion', '🧅'), w('orbit', '🛰️'),
      w('oasis', '🏝️'), w('olive', '🫒'), w('ocean', '🌊'), w('organ', '🎹'), w('opera', '🎭'),
    ],
    advancedWords: [
      w('octopus', '🐙'), w('ostrich', '🦤'), w('orange', '🍊'), w('origami', '🦢'), w('overcoat', '🧥'),
      w('orchard', '🍎'), w('omelet', '🍳'), w('opossum', '🦝'), w('officer', '👮'), w('oxygen', '🫧'),
    ],
  },
  {
    letter: 'p',
    sound: 'p',
    easyWords: [
      w('pan', '🍳'), w('pen', '🖊️'), w('pig', '🐷'), w('pot', '🏺'), w('pin', '📍'),
      w('pet', '🐶'), w('pie', '🥧'), w('pup', '🐕'), w('pad', '🗒️'), w('pop', '🎈'),
    ],
    mediumWords: [
      w('park', '🏞️'), w('plum', '🫐'), w('pool', '🏊'), w('pear', '🍐'), w('pink', '🩷'),
      w('pond', '🐸'), w('pipe', '🚰'), w('page', '📄'), w('path', '🛤️'), w('post', '📮'),
    ],
    advancedWords: [
      w('penguin', '🐧'), w('parrot', '🦜'), w('pencil', '✏️'), w('panda', '🐼'), w('pumpkin', '🎃'),
      w('pizza', '🍕'), w('planet', '🪐'), w('pillow', '🛏️'), w('puzzle', '🧩'), w('pocket', '👖'),
    ],
  },
  {
    letter: 'q',
    sound: 'kw',
    easyWords: [
      w('quiz', '📝'), w('quit', '🛑'), w('quay', '⚓'), w('quad', '🏍️'), w('quip', '💬'),
      w('quag', '🌾'), w('quin', '👶'), w('quid', '🪙'), w('quod', '🏛️'), w('quey', '🐄'),
    ],
    mediumWords: [
      w('queen', '👑'), w('quilt', '🛏️'), w('quick', '⚡'), w('quiet', '🤫'), w('quack', '🦆'),
      w('quest', '🧭'), w('quote', '💬'), w('quail', '🐦'), w('quart', '🥛'), w('quill', '🪶'),
    ],
    advancedWords: [
      w('quarter', '🪙'), w('question', '❓'), w('quiver', '🏹'), w('quaint', '🏡'), w('quintuplet', '👶'),
      w('quantum', '⚛️'), w('quality', '⭐'), w('quench', '🥤'), w('quokka', '🦘'), w('quadrant', '📐'),
    ],
  },
  {
    letter: 'r',
    sound: 'rrr',
    easyWords: [
      w('rat', '🐀'), w('red', '🔴'), w('rug', '🧶'), w('run', '🏃'), w('rip', '📄'),
      w('rod', '🎣'), w('row', '🚣'), w('rib', '🍖'), w('ram', '🐏'), w('ray', '☀️'),
    ],
    mediumWords: [
      w('rain', '🌧️'), w('ring', '💍'), w('rose', '🌹'), w('rope', '🪢'), w('rock', '🪨'),
      w('road', '🛣️'), w('roof', '🏠'), w('rice', '🍚'), w('root', '🌱'), w('read', '📖'),
    ],
    advancedWords: [
      w('rabbit', '🐇'), w('rainbow', '🌈'), w('rocket', '🚀'), w('robot', '🤖'), w('ruler', '📏'),
      w('ribbon', '🎀'), w('raccoon', '🦝'), w('radish', '🥗'), w('rooster', '🐓'), w('rhino', '🦏'),
    ],
  },
  {
    letter: 's',
    sound: 'sss',
    easyWords: [
      w('sun', '☀️'), w('sit', '🪑'), w('sad', '😢'), w('six', '6️⃣'), w('sea', '🌊'),
      w('son', '👦'), w('sow', '🐷'), w('sap', '🍯'), w('sip', '🥤'), w('sum', '➕'),
    ],
    mediumWords: [
      w('star', '⭐'), w('ship', '🚢'), w('sock', '🧦'), w('sand', '🏖️'), w('soap', '🧼'),
      w('seal', '🦭'), w('snow', '❄️'), w('soup', '🥣'), w('seed', '🌱'), w('silk', '🧣'),
    ],
    advancedWords: [
      w('spider', '🕷️'), w('strawberry', '🍓'), w('sandwich', '🥪'), w('snail', '🐌'), w('snowman', '⛄'),
      w('submarine', '🛥️'), w('scooter', '🛴'), w('squirrel', '🐿️'), w('sweater', '🧶'), w('sunflower', '🌻'),
    ],
  },
  {
    letter: 't',
    sound: 't',
    easyWords: [
      w('top', '🪀'), w('ten', '🔟'), w('tub', '🛁'), w('tag', '🏷️'), w('tap', '🚰'),
      w('tip', '💡'), w('tin', '🥫'), w('two', '2️⃣'), w('toe', '🦶'), w('toy', '🧸'),
    ],
    mediumWords: [
      w('tree', '🌳'), w('tent', '⛺'), w('tape', '📼'), w('toad', '🐸'), w('train', '🚂'),
      w('tiger', '🐯'), w('tail', '🐒'), w('tool', '🔧'), w('tank', '🛡️'), w('trap', '🪤'),
    ],
    advancedWords: [
      w('turtle', '🐢'), w('tractor', '🚜'), w('tomato', '🍅'), w('teapot', '🫖'), w('trumpet', '🎺'),
      w('toucan', '🦜'), w('traffic', '🚦'), w('tunnel', '🚇'), w('ticket', '🎟️'), w('table', '🪑'),
    ],
  },
  {
    letter: 'u',
    sound: 'uh',
    easyWords: [
      w('up', '⬆️'), w('us', '👥'), w('urn', '🏺'), w('use', '🛠️'), w('ump', '⚾'),
      w('unit', '📦'), w('undo', '↩️'), w('urge', '📣'), w('ugly', '👹'), w('upon', '🔝'),
    ],
    mediumWords: [
      w('uncle', '👨'), w('under', '⬇️'), w('until', '⏳'), w('union', '🤝'), w('urban', '🏙️'),
      w('upset', '😣'), w('unzip', '🤐'), w('unite', '🤲'), w('usage', '📊'), w('usher', '🔦'),
    ],
    advancedWords: [
      w('umbrella', '☂️'), w('unicorn', '🦄'), w('uniform', '🥋'), w('universe', '🌌'), w('unicycle', '🚲'),
      w('utensil', '🍴'), w('umpire', '⚾'), w('ukulele', '🪕'), w('upgrade', '📈'), w('urchin', '🦔'),
    ],
  },
  {
    letter: 'v',
    sound: 'vvv',
    easyWords: [
      w('van', '🚐'), w('vet', '🩺'), w('vat', '🛢️'), w('vow', '💍'), w('vex', '😠'),
      w('via', '🛣️'), w('vig', '🪙'), w('vim', '⚡'), w('vox', '🗣️'), w('vug', '🪨'),
    ],
    mediumWords: [
      w('vase', '🏺'), w('vest', '🦺'), w('vine', '🍇'), w('vote', '🗳️'), w('view', '🏞️'),
      w('voice', '🎤'), w('valve', '🚰'), w('vapor', '💨'), w('visit', '🤝'), w('vivid', '🌈'),
    ],
    advancedWords: [
      w('volcano', '🌋'), w('violin', '🎻'), w('village', '🏡'), w('vacuum', '🧹'), w('vanilla', '🍦'),
      w('vampire', '🧛'), w('vehicle', '🚗'), w('valley', '🏞️'), w('vulture', '🦅'), w('velvet', '👗'),
    ],
  },
  {
    letter: 'w',
    sound: 'w',
    easyWords: [
      w('web', '🕸️'), w('wig', '💇'), w('wet', '💦'), w('win', '🏆'), w('wax', '🕯️'),
      w('way', '🛤️'), w('war', '⚔️'), w('wag', '🐕'), w('wok', '🍳'), w('won', '🥇'),
    ],
    mediumWords: [
      w('wind', '💨'), w('wall', '🧱'), w('wolf', '🐺'), w('worm', '🪱'), w('wood', '🪵'),
      w('wave', '🌊'), w('wing', '🪽'), w('well', '🪣'), w('wish', '🌠'), w('wire', '🔌'),
    ],
    advancedWords: [
      w('walrus', '🦭'), w('wagon', '🛒'), w('watermelon', '🍉'), w('window', '🪟'), w('whistle', '🌬️'),
      w('wizard', '🧙'), w('waffle', '🧇'), w('winter', '❄️'), w('walnut', '🥜'), w('windmill', '🌬️'),
    ],
  },
  {
    letter: 'x',
    sound: 'ks',
    easyWords: [
      w('box', '📦'), w('fox', '🦊'), w('six', '6️⃣'), w('mix', '🥣'), w('fix', '🔧'),
      w('axe', '🪓'), w('tax', '🧾'), w('wax', '🕯️'), w('sax', '🎷'), w('max', '🔝'),
    ],
    mediumWords: [
      w('x-ray', '🩻'), w('extra', '⭐'), w('toxic', '☣️'), w('relax', '🧘'), w('index', '☝️'),
      w('pixel', '👾'), w('mixer', '🎛️'), w('boxer', '🥊'), w('vixen', '🦊'), w('fixer', '🔨'),
    ],
    advancedWords: [
      w('xylophone', '🎶'), w('exercise', '🏃'), w('explorer', '🧭'), w('galaxy', '🌌'), w('oxygen', '🫧'),
      w('maximum', '📶'), w('taxicab', '🚕'), w('flexible', '🤸'), w('crucifix', '✝️'), w('boxing', '🥊'),
    ],
  },
  {
    letter: 'y',
    sound: 'y',
    easyWords: [
      w('yak', '🐂'), w('yam', '🍠'), w('yes', '✅'), w('yep', '👍'), w('yen', '💴'),
      w('yet', '⏳'), w('yip', '🐶'), w('you', '👉'), w('yum', '😋'), w('yap', '🗣️'),
    ],
    mediumWords: [
      w('yard', '🏡'), w('yarn', '🧶'), w('yell', '📢'), w('yo-yo', '🪀'), w('yawn', '🥱'),
      w('yolk', '🍳'), w('year', '📅'), w('yoga', '🧘'), w('yacht', '🛥️'), w('young', '🧒'),
    ],
    advancedWords: [
      w('yellow', '🟡'), w('yogurt', '🥣'), w('yesterday', '🗓️'), w('yardstick', '📏'), w('youngster', '👦'),
      w('yearbook', '📚'), w('yodeling', '🏔️'), w('yellowtail', '🐟'), w('yellowjacket', '🐝'), w('yield', '⚠️'),
    ],
  },
  {
    letter: 'z',
    sound: 'zzz',
    easyWords: [
      w('zip', '🤐'), w('zoo', '🦒'), w('zap', '⚡'), w('zag', '〰️'), w('zen', '🧘'),
      w('zit', '🔴'), w('zed', '🇿'), w('buzz', '🐝'), w('fizz', '🥤'), w('fuzz', '🍑'),
    ],
    mediumWords: [
      w('zero', '0️⃣'), w('zone', '🚧'), w('zeal', '🔥'), w('zest', '🍋'), w('zinc', '⚙️'),
      w('zoom', '🔍'), w('maze', '🌀'), w('size', '📐'), w('prize', '🏆'), w('blaze', '🔥'),
    ],
    advancedWords: [
      w('zebra', '🦓'), w('zipper', '🤐'), w('zucchini', '🥒'), w('zookeeper', '🦁'), w('zodiac', '♈'),
      w('zigzag', '⚡'), w('zeppelin', '🎈'), w('zenith', '☀️'), w('zircon', '💎'), w('zeroing', '🎯'),
    ],
  },
];

/** Get the 10 words for a letter based on chosen difficulty tier */
export function getWordsForLetter(entry: AlphabetEntry, tier: DifficultyTier): AlphabetWord[] {
  switch (tier) {
    case 'easy':
      return entry.easyWords;
    case 'medium':
      return entry.mediumWords;
    case 'advanced':
      return entry.advancedWords;
    default:
      return entry.easyWords;
  }
}

/** Flatten all words for a specific tier for global practice/tests */
export function getAllWordsForTier(tier: DifficultyTier): AlphabetWord[] {
  return ALPHABET.flatMap((e) => getWordsForLetter(e, tier));
}

/** Pick a random sample of words for testing */
export function pickTierTestWords(tier: DifficultyTier, count: number = 10): AlphabetWord[] {
  const pool = [...getAllWordsForTier(tier)].sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
}
