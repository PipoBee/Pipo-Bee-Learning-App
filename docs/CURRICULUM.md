# Phonics Game — Master Curriculum Specification

**Product:** Phonics Game  
**Target:** Beginner Students Learning to Read English Aloud  
**Input Mode:** Voice Only (No Tracing, No Typing, No Handwriting)  
**Spelling Dialect:** US English (`en-US`)  

---

## 1. Curriculum Architecture

The Phonics Game curriculum is divided into four progressive, data-driven levels.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1: Alphabet Sounds & Test (All 26 Letters)                                       │
│ ├── 3 Difficulty Options: [ Easy ] [ Medium ] [ Advanced ]                             │
│ ├── 10 Distinct Example Words per Option (30 Distinct Words per Letter = 780 Total)    │
│ └── Voice Flow: Meet Sound -> Say Sound -> 10-Word Voice Parade -> Letter Test & Stars │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LEVEL 2: Blend Random Words (Grapheme Sound Tiles)                                     │
│ ├── Tier 1 (Easy): 3-Letter CVC Words (cat, sun, bed, dog)                             │
│ ├── Tier 2 (Medium): 4–5 Letters with Blends & Digraphs (frog, ship, lamp, fish)       │
│ └── Tier 3 (Advanced): 6+ Letters, 2 Syllables & Vowel Teams (rabbit, rainbow, chicken)│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LEVEL 3: Common Words & Patterns (Data-Driven & Replaceable)                           │
│ ├── Tier 1 (Easy): High-Frequency Sight Words (the, is, you, said, was)                │
│ ├── Tier 2 (Medium): Word Families with Highlighted Rimes (-at, -ig, -ake, -ight)      │
│ └── Tier 3 (Advanced): Tricky Spellings & Silent Letters (knee, light, would, write)   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LEVEL 4: Read Sentences of 3 to 4 Words (Word-by-Word Streaming Recognition)           │
│ ├── Tier 1 (Easy): Common CVC & Sight Words ("The cat sat.", "I see a dog.")          │
│ ├── Tier 2 (Medium): Blends & Digraph Words ("The frog can jump.", "We saw the ship.") │
│ └── Tier 3 (Advanced): Advanced Decodable Words ("The rabbit hops fast.")              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Level 1: Alphabet Sounds & 10-Word Voice Test (All 26 Letters)

### Structure & Progression
- **Interactive Letter Map:** All 26 letters (A–Z) with stars earned per tier.
- **Difficulty Options Pill:** Student or parent selects **[ Easy ]**, **[ Medium ]**, or **[ Advanced ]**.
- **Voice Flow per Letter:**
  1. **Meet the Sound:** Mascot articulates authentic isolated phoneme sound (`/æ/`, `/b/`, `/k/`, etc.) from pre-recorded audio.
  2. **Say the Sound:** Student articulates sound into the microphone; verified via `speech_variants` table.
  3. **10-Word Voice Parade:** 10 words appropriate for the chosen tier presented as pure text (no picture hints, enforcing authentic letter-sound decoding). Speaker button allows listening to pronunciation first.
  4. **Letter Voice Test & Stars:** Evaluates accuracy on the 10 words as pure text targets. 3 Stars for $\ge 80\%$ first-try accuracy.

---

### Complete Level 1 Word Master List (10 Easy, 10 Medium, 10 Advanced per Letter)

#### Letter A (`/æ/`)
- **Easy (10):** `ant`, `axe`, `ape`, `arm`, `ash`, `act`, `add`, `air`, `aid`, `age`
- **Medium (10):** `apple`, `acorn`, `arrow`, `alarm`, `angel`, `apron`, `amber`, `alley`, `atlas`, `alien`
- **Advanced (10):** `anchor`, `astronaut`, `alligator`, `alphabet`, `avocado`, `acrobat`, `apricot`, `actress`, `athlete`, `animals`

#### Letter B (`/b/`)
- **Easy (10):** `bat`, `bag`, `bed`, `bin`, `box`, `bug`, `bus`, `bun`, `boy`, `bow`
- **Medium (10):** `ball`, `bird`, `blue`, `boat`, `book`, `boot`, `bell`, `bark`, `barn`, `bear`
- **Advanced (10):** `banana`, `basket`, `butter`, `button`, `balloon`, `blanket`, `bridge`, `beetle`, `brother`, `bottle`

#### Letter C (`/k/`)
- **Easy (10):** `cat`, `can`, `cap`, `cup`, `cow`, `car`, `cot`, `cub`, `cry`, `cut`
- **Medium (10):** `cake`, `camp`, `card`, `cold`, `corn`, `crab`, `crow`, `clip`, `coat`, `clown`
- **Advanced (10):** `candle`, `camera`, `castle`, `cookie`, `carrot`, `caterpillar`, `coconut`, `circus`, `crayon`, `cricket`

#### Letter D (`/d/`)
- **Easy (10):** `dad`, `dog`, `dig`, `dot`, `dip`, `den`, `dam`, `day`, `dry`, `dew`
- **Medium (10):** `duck`, `drum`, `door`, `desk`, `dark`, `deer`, `dive`, `drop`, `doll`, `dirt`
- **Advanced (10):** `dolphin`, `dragon`, `dinosaur`, `dentist`, `doctor`, `diamond`, `donkey`, `dinner`, `dancer`, `daisy`

#### Letter E (`/ɛ/`)
- **Easy (10):** `egg`, `elf`, `elk`, `ear`, `eye`, `end`, `eat`, `emu`, `era`, `ebb`
- **Medium (10):** `eagle`, `empty`, `enter`, `earth`, `elbow`, `eight`, `every`, `entry`, `event`, `extra`
- **Advanced (10):** `elephant`, `engine`, `emerald`, `explore`, `energy`, `envelope`, `escalator`, `eclipse`, `exercise`, `element`

#### Letter F (`/f/`)
- **Easy (10):** `fan`, `fox`, `fat`, `fin`, `fit`, `fog`, `fun`, `fly`, `few`, `fur`
- **Medium (10):** `fish`, `frog`, `flag`, `fire`, `foot`, `fork`, `farm`, `fast`, `four`, `five`
- **Advanced (10):** `feather`, `flamingo`, `flower`, `forest`, `farmer`, `finger`, `flute`, `factory`, `freeze`, `football`

#### Letter G (`/ɡ/`)
- **Easy (10):** `gas`, `gap`, `gem`, `get`, `gum`, `god`, `gut`, `guy`, `gym`, `gun`
- **Medium (10):** `goat`, `gold`, `girl`, `gate`, `gift`, `game`, `golf`, `grow`, `gray`, `glow`
- **Advanced (10):** `giraffe`, `garden`, `guitar`, `gorilla`, `glasses`, `grapes`, `gloves`, `glider`, `garlic`, `giant`

#### Letter H (`/h/`)
- **Easy (10):** `hat`, `hen`, `ham`, `hot`, `hug`, `hop`, `hut`, `hay`, `him`, `her`
- **Medium (10):** `hand`, `hill`, `home`, `horn`, `hair`, `hawk`, `hook`, `hole`, `help`, `hard`
- **Advanced (10):** `helicopter`, `helmet`, `hippo`, `hamster`, `honey`, `hammer`, `hospital`, `harvest`, `holiday`, `hanger`

#### Letter I (`/ɪ/`)
- **Easy (10):** `ink`, `ice`, `ill`, `inn`, `ivy`, `ion`, `its`, `ire`, `irk`, `ilk`
- **Medium (10):** `igloo`, `iron`, `item`, `itch`, `inch`, `idea`, `icon`, `into`, `isle`, `iris`
- **Advanced (10):** `iguana`, `island`, `insect`, `invite`, `invent`, `inside`, `infant`, `icicle`, `instrument`, `impact`

#### Letter J (`/dʒ/`)
- **Easy (10):** `jam`, `jar`, `jet`, `jog`, `jug`, `jaw`, `joy`, `job`, `jig`, `jot`
- **Medium (10):** `jump`, `jeep`, `joke`, `june`, `july`, `join`, `junk`, `jade`, `jail`, `jazz`
- **Advanced (10):** `jellyfish`, `jacket`, `jungle`, `jumper`, `jaguar`, `jester`, `journal`, `jigsaw`, `journey`, `jewel`

#### Letter K (`/k/`)
- **Easy (10):** `key`, `kid`, `kit`, `keg`, `kin`, `kip`, `ken`, `koi`, `kat`, `kay`
- **Medium (10):** `kite`, `king`, `kiss`, `knee`, `kick`, `keep`, `knot`, `kettle`, `kale`, `kiwi`
- **Advanced (10):** `kangaroo`, `kitchen`, `koala`, `kitten`, `keyboard`, `ketchup`, `kayak`, `knitting`, `kingdom`, `kumquat`

#### Letter L (`/l/`)
- **Easy (10):** `leg`, `lip`, `log`, `lid`, `lap`, `low`, `let`, `lit`, `lay`, `lad`
- **Medium (10):** `lion`, `lamp`, `leaf`, `lake`, `lock`, `lamb`, `line`, `lime`, `luck`, `loud`
- **Advanced (10):** `ladybug`, `lemon`, `ladder`, `lizard`, `lighthouse`, `lobster`, `letter`, `lantern`, `library`, `leopard`

#### Letter M (`/m/`)
- **Easy (10):** `mat`, `map`, `man`, `mud`, `mop`, `mug`, `men`, `mix`, `mom`, `meow`
- **Medium (10):** `moon`, `milk`, `mask`, `mole`, `maze`, `mouse`, `moth`, `meat`, `mail`, `mint`
- **Advanced (10):** `monkey`, `magnet`, `monster`, `muffin`, `market`, `mushroom`, `melon`, `mirror`, `mittens`, `morning`

#### Letter N (`/n/`)
- **Easy (10):** `nut`, `net`, `nap`, `nod`, `new`, `now`, `not`, `nip`, `nib`, `nil`
- **Medium (10):** `nest`, `nose`, `nine`, `neck`, `nail`, `note`, `noon`, `name`, `near`, `neat`
- **Advanced (10):** `necklace`, `napkin`, `needle`, `nurse`, `noodle`, `night`, `ninja`, `nature`, `number`, `newt`

#### Letter O (`/ɒ/`)
- **Easy (10):** `owl`, `oak`, `oar`, `oil`, `old`, `one`, `our`, `out`, `off`, `oxen`
- **Medium (10):** `otter`, `open`, `oven`, `onion`, `orbit`, `oasis`, `olive`, `ocean`, `organ`, `opera`
- **Advanced (10):** `octopus`, `ostrich`, `orange`, `origami`, `overcoat`, `orchard`, `omelet`, `opossum`, `officer`, `oxygen`

#### Letter P (`/p/`)
- **Easy (10):** `pan`, `pen`, `pig`, `pot`, `pin`, `pet`, `pie`, `pup`, `pad`, `pop`
- **Medium (10):** `park`, `plum`, `pool`, `pear`, `pink`, `pond`, `pipe`, `page`, `path`, `post`
- **Advanced (10):** `penguin`, `parrot`, `pencil`, `panda`, `pumpkin`, `pizza`, `planet`, `pillow`, `puzzle`, `pocket`

#### Letter Q (`/kw/`)
- **Easy (10):** `quiz`, `quit`, `quay`, `quad`, `quip`, `quag`, `quin`, `quid`, `quod`, `quey`
- **Medium (10):** `queen`, `quilt`, `quick`, `quiet`, `quack`, `quest`, `quote`, `quail`, `quart`, `quill`
- **Advanced (10):** `quarter`, `question`, `quiver`, `quaint`, `quintuplet`, `quantum`, `quality`, `quench`, `quokka`, `quadrant`

#### Letter R (`/r/`)
- **Easy (10):** `rat`, `red`, `rug`, `run`, `rip`, `rod`, `row`, `rib`, `ram`, `ray`
- **Medium (10):** `rain`, `ring`, `rose`, `rope`, `rock`, `road`, `roof`, `rice`, `root`, `read`
- **Advanced (10):** `rabbit`, `rainbow`, `rocket`, `robot`, `ruler`, `ribbon`, `raccoon`, `radish`, `rooster`, `rhino`

#### Letter S (`/s/`)
- **Easy (10):** `sun`, `sit`, `sad`, `six`, `sea`, `son`, `sow`, `sap`, `sip`, `sum`
- **Medium (10):** `star`, `ship`, `sock`, `sand`, `soap`, `seal`, `snow`, `soup`, `seed`, `silk`
- **Advanced (10):** `spider`, `strawberry`, `sandwich`, `snail`, `snowman`, `submarine`, `scooter`, `squirrel`, `sweater`, `sunflower`

#### Letter T (`/t/`)
- **Easy (10):** `top`, `ten`, `tub`, `tag`, `tap`, `tip`, `tin`, `two`, `toe`, `toy`
- **Medium (10):** `tree`, `tent`, `tape`, `toad`, `train`, `tiger`, `tail`, `tool`, `tank`, `trap`
- **Advanced (10):** `turtle`, `tractor`, `tomato`, `teapot`, `trumpet`, `toucan`, `traffic`, `tunnel`, `ticket`, `table`

#### Letter U (`/ʌ/`)
- **Easy (10):** `up`, `us`, `urn`, `use`, `ump`, `unit`, `undo`, `urge`, `ugly`, `upon`
- **Medium (10):** `uncle`, `under`, `until`, `union`, `urban`, `upset`, `unzip`, `unite`, `usage`, `usher`
- **Advanced (10):** `umbrella`, `unicorn`, `uniform`, `universe`, `unicycle`, `utensil`, `umpire`, `ukulele`, `upgrade`, `urchin`

#### Letter V (`/v/`)
- **Easy (10):** `van`, `vet`, `vat`, `vow`, `vex`, `via`, `vig`, `vim`, `vox`, `vug`
- **Medium (10):** `vase`, `vest`, `vine`, `vote`, `view`, `voice`, `valve`, `vapor`, `visit`, `vivid`
- **Advanced (10):** `volcano`, `violin`, `village`, `vacuum`, `vanilla`, `vampire`, `vehicle`, `valley`, `vulture`, `velvet`

#### Letter W (`/w/`)
- **Easy (10):** `web`, `wig`, `wet`, `win`, `wax`, `way`, `war`, `wag`, `wok`, `won`
- **Medium (10):** `wind`, `wall`, `wolf`, `worm`, `wood`, `wave`, `wing`, `well`, `wish`, `wire`
- **Advanced (10):** `walrus`, `wagon`, `watermelon`, `window`, `whistle`, `wizard`, `waffle`, `winter`, `walnut`, `windmill`

#### Letter X (`/ks/`)
- **Easy (10):** `box`, `fox`, `six`, `mix`, `fix`, `axe`, `tax`, `wax`, `sax`, `max`
- **Medium (10):** `x-ray`, `extra`, `toxic`, `relax`, `index`, `pixel`, `mixer`, `boxer`, `vixen`, `fixer`
- **Advanced (10):** `xylophone`, `x-ray fish`, `exercise`, `explorer`, `galaxy`, `oxygen`, `maximum`, `taxicab`, `flexible`, `crucifix`

#### Letter Y (`/j/`)
- **Easy (10):** `yak`, `yam`, `yes`, `yep`, `yen`, `yet`, `yip`, `you`, `yum`, `yap`
- **Medium (10):** `yard`, `yarn`, `yell`, `yo-yo`, `yawn`, `yolk`, `year`, `yoga`, `yacht`, `young`
- **Advanced (10):** `yellow`, `yogurt`, `yesterday`, `yardstick`, `youngster`, `yearbook`, `yodeling`, `yellowtail`, `yellowjacket`, `yield`

#### Letter Z (`/z/`)
- **Easy (10):** `zip`, `zoo`, `zap`, `zag`, `zen`, `zit`, `zed`, `buzz`, `fizz`, `fuzz`
- **Medium (10):** `zero`, `zone`, `zeal`, `zest`, `zinc`, `zoom`, `maze`, `size`, `prize`, `blaze`
- **Advanced (10):** `zebra`, `zipper`, `zucchini`, `zookeeper`, `zodiac`, `zigzag`, `zeppelin`, `zenith`, `zircon`, `zeroing`

---

## 3. Level 2: Blend Random Words (3 Tiers)

Each session presents **8 random words** from the selected tier. Grapheme tiles light up sequentially with sound, and the child blends and articulates the full word.

- **Tier 1 (Easy - 3-Letter CVC):** *bat, cat, fat, hat, mat, rat, bed, hen, net, pen, red, ten, bin, dip, fin, lip, pin, sit, tin, win, box, dog, fox, hop, hot, mop, pot, top, bug, bus, cup, hug, mud, nut, run, sun, tub*.
- **Tier 2 (Medium - Blends & Digraphs):** *black, blend, block, brush, clap, clock, crab, crash, drum, flag, flash, flat, frog, glad, grab, grass, green, hand, jump, lamp, mask, milk, nest, pink, plant, plum, sand, ship, shop, sink, slap, slip, slug, snack, snap, spin, spot, step, stop, swim, test, track, trap, wind*.
- **Tier 3 (Advanced - 2 Syllables & Vowel Teams):** *basket, button, candle, carpet, chicken, dental, dinner, dentist, gallon, helmet, hidden, insect, kitten, magnet, market, muffin, napkin, picnic, pocket, puppet, rabbit, ribbon, sunset, yellow, boat, coat, rain, sail, meat, seed, moon, pool, book, coin, boil*.

---

## 4. Level 3: Common Words & Patterns (3 Tiers)

- **Tier 1 (Easy - Sight Words):** *the, is, you, said, was, are, they, come, some, does, have, what, where, who, from, here, give, were, look, your*.
- **Tier 2 (Medium - Word Families):**
  - `-at`: *cat, bat, hat, mat, rat, sat, pat*
  - `-ig`: *big, dig, fig, pig, wig, twig*
  - `-ake`: *bake, cake, lake, make, take, wake*
  - `-ight`: *light, night, fight, right, bright, sight*
  - `-op`: *hop, mop, pop, top, drop, stop*
  - `-ell`: *bell, fell, tell, well, shell, smell*
  - `-un`: *bun, fun, run, sun, spun*
- **Tier 3 (Advanced - Silent Letters & Tricky Patterns):**
  - `kn-`: *knee, knit, knot, knock, knife*
  - `wr-`: *wrap, wrist, write, wrong, wreck*
  - `-mb`: *lamb, thumb, climb, comb, crumb*
  - Tricky vowels: *could, would, should, though, through*

---

## 5. Level 4: Read Sentences of 3 to 4 Words (3 Tiers)

- **Tier 1 (Easy - Common Words):**
  - *The cat sat.* | *I see a dog.* | *The sun is hot.* | *He ran fast.* | *Look at the pig.* | *The dog can run.* | *She has a hat.* | *A big red bus.* | *The cup is hot.* | *We see the cat.* | *I like my dog.* | *The pig is pink.* | *He sat on it.* | *The fox ran fast.* | *We can play now.*
- **Tier 2 (Medium - Blends & Digraphs):**
  - *The frog can jump.* | *We saw the ship.* | *The lamp is on.* | *A crab can swim.* | *The fish is blue.* | *She has a clock.* | *The green flag waved.* | *He lost his milk.* | *The brush is clean.* | *A bird can fly.* | *The black cat slept.* | *I see the star.* | *The wind was cold.* | *Stop at the light.* | *The drum was loud.*
- **Tier 3 (Advanced - Advanced Vocabulary):**
  - *The rabbit hops fast.* | *I see the light.* | *The kitten was cute.* | *We love to read.* | *The sunset is warm.* | *She wrote a note.* | *The chicken laid eggs.* | *He had a picnic.* | *The puppy had fun.* | *She ate yellow cheese.* | *The boat sailed away.* | *They saw two rabbits.* | *The market is open.* | *He wore a helmet.* | *She found a basket.*

---

## 6. Grade 3 Weekly Tasks (Weeks 1 – 8)

**Pedagogical Objective:** Students **Blend**, **Read**, and **Learn** 10 curated Grade 3 phonics words each week with authentic syllable chunking and voice speech recognition. All words are presented as pure text (no pictures) to enforce true phonological decoding.

### Master Weekly Word Lists (80 Words Total)

#### Week 1: Core Vocabulary & Tricky Vowels
1. `beautiful` (beau-ti-ful)
2. `favourite` (fa-vour-ite)
3. `different` (dif-fer-ent)
4. `important` (im-por-tant)
5. `because` (be-cause)
6. `enough` (e-nough)
7. `people` (peo-ple)
8. `together` (to-geth-er)
9. `through` (thr-ough)
10. `thought` (th-ought)

#### Week 2: Manner Adverbs (-ly Suffix)
1. `suddenly` (sud-den-ly)
2. `carefully` (care-ful-ly)
3. `quietly` (qui-et-ly)
4. `quickly` (quick-ly)
5. `loudly` (loud-ly)
6. `slowly` (slow-ly)
7. `finally` (fi-nal-ly)
8. `usually` (u-su-al-ly)
9. `actually` (ac-tu-al-ly)
10. `perhaps` (per-haps)

#### Week 3: Feelings & Emotional Reactions
1. `month` (mon-th)
2. `excited` (ex-cit-ed)
3. `worried` (wor-ried)
4. `cheerful` (cheer-ful)
5. `lonely` (lone-ly)
6. `disappointed` (dis-ap-point-ed)
7. `amazing` (a-maz-ing)
8. `embarrassed` (em-bar-rassed)
9. `impatient` (im-pa-tient)
10. `exhausted` (ex-haust-ed)

#### Week 4: Adventure & Story Words
1. `mysterious` (mys-te-ri-ous)
2. `dangerous` (dan-ger-ous)
3. `magical` (mag-i-cal)
4. `enormous` (e-nor-mous)
5. `forest` (for-est)
6. `village` (vil-lage)
7. `mountain` (moun-tain)
8. `journey` (jour-ney)
9. `adventure` (ad-ven-ture)
10. `stranger` (stran-ger)

#### Week 5: Expressive Adjectives & Reactions
1. `frightened` (fright-ened)
2. `surprised` (sur-prised)
3. `delicious` (de-li-cious)
4. `delighted` (de-light-ed)
5. `terrified` (ter-ri-fied)
6. `amazed` (a-mazed)
7. `confused` (con-fused)
8. `relieved` (re-lieved)
9. `astonished` (as-ton-ished)
10. `cautious` (cau-tious)

#### Week 6: Atmospheric & Setting Adjectives
1. `ancient` (an-cient)
2. `treasure` (trea-sure)
3. `creature` (crea-ture)
4. `spectacular` (spec-tac-u-lar)
5. `peaceful` (peace-ful)
6. `gigantic` (gi-gan-tic)
7. `shadowy` (shad-ow-y)
8. `sparkling` (spar-kling)
9. `distant` (dis-tant)
10. `incredible` (in-cred-i-ble)

#### Week 7: Past-Tense Action Verbs (-ed)
1. `whispered` (whis-pered)
2. `discovered` (dis-cov-ered)
3. `disappeared` (dis-ap-peared)
4. `remembered` (re-mem-bered)
5. `followed` (fol-lowed)
6. `searched` (sear-ched)
7. `noticed` (no-ticed)
8. `explored` (ex-plored)
9. `escaped` (es-caped)
10. `approached` (ap-proached)

#### Week 8: Narrative Transition & Complex Words
1. `imagination` (i-mag-i-na-tion)
2. `excitement` (ex-cite-ment)
3. `fortunately` (for-tu-nate-ly)
4. `meanwhile` (mean-while)
5. `although` (al-though)
6. `unexpected` (un-ex-pect-ed)
7. `remarkable` (re-mark-a-ble)
8. `solution` (so-lu-tion)
9. `beginning` (be-gin-ning)
10. `conclusion` (con-clu-sion)

