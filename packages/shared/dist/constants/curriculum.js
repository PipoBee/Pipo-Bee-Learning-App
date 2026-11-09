"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_CURRICULUM = void 0;
const curriculum_words_1 = require("./curriculum-words");
const BASE_CURRICULUM = [
    // WORLD 1: Island of First Sounds
    {
        id: 'world-1',
        code: 'W1',
        title: 'Island of First Sounds',
        description: 'Learn foundational consonants and short vowels: s, a, t, and start blending words!',
        orderIndex: 1,
        themeColor: '#4ADE80',
        accentColor: '#16A34A',
        iconName: 'palm-tree',
        levels: [
            {
                id: 'level-w1-l1',
                worldId: 'world-1',
                title: 'Sound /s/',
                subtitle: 'The Hissing Snake',
                soundLabel: 's',
                orderIndex: 1,
                requiredStars: 0,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w1-l1-t1',
                        levelId: 'level-w1-l1',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /s/',
                        instructionText: 'Listen to the sound and tap the letter that matches!',
                        items: [
                            {
                                id: 'item-w1-l1-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 's',
                                targetPhoneme: '/s/',
                                promptText: 'Tap the letter that makes the /s/ sound!',
                                options: [
                                    { id: 'opt-1', label: 's', isCorrect: true },
                                    { id: 'opt-2', label: 'm', isCorrect: false },
                                    { id: 'opt-3', label: 'b', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w1-l1-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 's',
                                targetPhoneme: '/s/',
                                targetWord: 'Sun',
                                promptText: 'Which picture starts with the /s/ sound?',
                                options: [
                                    { id: 'opt-4', label: '☀️ Sun', isCorrect: true },
                                    { id: 'opt-5', label: '🐶 Dog', isCorrect: false },
                                    { id: 'opt-6', label: '🐱 Cat', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w1-l1-t1-3',
                                orderIndex: 3,
                                targetGrapheme: 's',
                                targetPhoneme: '/s/',
                                targetWord: 'Snake',
                                promptText: 'Find another word that begins with /s/!',
                                options: [
                                    { id: 'opt-7', label: '🐍 Snake', isCorrect: true },
                                    { id: 'opt-8', label: '🐸 Frog', isCorrect: false },
                                    { id: 'opt-9', label: '🐻 Bear', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w1-l1-t2',
                        levelId: 'level-w1-l1',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: s',
                        instructionText: 'Follow the glowing dots to trace lowercase s!',
                        items: [
                            {
                                id: 'item-w1-l1-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 's',
                                targetPhoneme: '/s/',
                                promptText: 'Trace lowercase s: curve left, snake down, and curve right!',
                                tracingData: {
                                    grapheme: 's',
                                    phoneme: '/s/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 210 110 C 190 75 125 75 110 115 C 95 155 205 175 195 220 C 185 260 115 265 90 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Slide around like a snake!',
                                            startPoint: { x: 210, y: 110 },
                                            endPoint: { x: 90, y: 230 },
                                            points: [
                                                { x: 210, y: 110 },
                                                { x: 175, y: 80 },
                                                { x: 130, y: 85 },
                                                { x: 105, y: 120 },
                                                { x: 125, y: 155 },
                                                { x: 165, y: 175 },
                                                { x: 195, y: 200 },
                                                { x: 190, y: 235 },
                                                { x: 150, y: 255 },
                                                { x: 105, y: 245 },
                                                { x: 90, y: 230 }
                                            ]
                                        }
                                    ],
                                    sampleWords: ['sun', 'snake', 'star']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w1-l2',
                worldId: 'world-1',
                title: 'Sound /a/',
                subtitle: 'The Cheerful Apple',
                soundLabel: 'a',
                orderIndex: 2,
                requiredStars: 1,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w1-l2-t1',
                        levelId: 'level-w1-l2',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /a/',
                        instructionText: 'Listen for the short /æ/ vowel sound!',
                        items: [
                            {
                                id: 'item-w1-l2-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'a',
                                targetPhoneme: '/æ/',
                                promptText: 'Tap the letter that makes the /a/ sound!',
                                options: [
                                    { id: 'opt-201', label: 'a', isCorrect: true },
                                    { id: 'opt-202', label: 'o', isCorrect: false },
                                    { id: 'opt-203', label: 'u', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w1-l2-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'a',
                                targetPhoneme: '/æ/',
                                targetWord: 'Apple',
                                promptText: 'Which picture starts with the /a/ sound?',
                                options: [
                                    { id: 'opt-204', label: '🍎 Apple', isCorrect: true },
                                    { id: 'opt-205', label: '🍌 Banana', isCorrect: false },
                                    { id: 'opt-206', label: '🍇 Grapes', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w1-l2-t2',
                        levelId: 'level-w1-l2',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: a',
                        instructionText: 'Circle around and pull down straight!',
                        items: [
                            {
                                id: 'item-w1-l2-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'a',
                                targetPhoneme: '/æ/',
                                promptText: 'Trace lowercase a: circle left, then pull down!',
                                tracingData: {
                                    grapheme: 'a',
                                    phoneme: '/æ/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 195 130 C 180 95 110 95 95 160 C 85 220 180 240 195 190 M 195 100 L 195 240',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Circle around to the left!',
                                            startPoint: { x: 190, y: 120 },
                                            endPoint: { x: 190, y: 190 },
                                            points: [
                                                { x: 190, y: 120 },
                                                { x: 140, y: 100 },
                                                { x: 95, y: 140 },
                                                { x: 95, y: 190 },
                                                { x: 140, y: 230 },
                                                { x: 190, y: 190 }
                                            ]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Pull straight down!',
                                            startPoint: { x: 195, y: 100 },
                                            endPoint: { x: 195, y: 240 },
                                            points: [
                                                { x: 195, y: 100 },
                                                { x: 195, y: 170 },
                                                { x: 195, y: 240 }
                                            ]
                                        }
                                    ],
                                    sampleWords: ['apple', 'ant', 'astronaut']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w1-l3',
                worldId: 'world-1',
                title: 'Sound /t/',
                subtitle: 'The Tall Tower',
                soundLabel: 't',
                orderIndex: 3,
                requiredStars: 2,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w1-l3-t1',
                        levelId: 'level-w1-l3',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /t/',
                        instructionText: 'Hear the crisp /t/ sound and pick the match!',
                        items: [
                            {
                                id: 'item-w1-l3-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 't',
                                targetPhoneme: '/t/',
                                promptText: 'Tap the letter that makes the /t/ sound!',
                                options: [
                                    { id: 'opt-301', label: 't', isCorrect: true },
                                    { id: 'opt-302', label: 'l', isCorrect: false },
                                    { id: 'opt-303', label: 'f', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w1-l3-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 't',
                                targetPhoneme: '/t/',
                                targetWord: 'Tiger',
                                promptText: 'Which picture starts with the /t/ sound?',
                                options: [
                                    { id: 'opt-304', label: '🐯 Tiger', isCorrect: true },
                                    { id: 'opt-305', label: '🦁 Lion', isCorrect: false },
                                    { id: 'opt-306', label: '🐘 Elephant', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w1-l3-t1-3',
                                orderIndex: 3,
                                targetGrapheme: 'sat',
                                targetPhoneme: '/s/ /æ/ /t/',
                                targetWord: 'sat',
                                promptText: 'Blend: /s/ + /a/ + /t/. What word does it make?',
                                options: [
                                    { id: 'opt-307', label: 'sat', isCorrect: true },
                                    { id: 'opt-308', label: 'mat', isCorrect: false },
                                    { id: 'opt-309', label: 'pat', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w1-l3-t2',
                        levelId: 'level-w1-l3',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: t',
                        instructionText: 'Pull down tall and cross across the middle!',
                        items: [
                            {
                                id: 'item-w1-l3-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 't',
                                targetPhoneme: '/t/',
                                promptText: 'Trace lowercase t: pull down, then cross!',
                                tracingData: {
                                    grapheme: 't',
                                    phoneme: '/t/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 150 60 L 150 220 C 150 245 175 245 190 235 M 105 130 L 195 130',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Start at the top, pull straight down with a curl!',
                                            startPoint: { x: 150, y: 60 },
                                            endPoint: { x: 190, y: 235 },
                                            points: [
                                                { x: 150, y: 60 },
                                                { x: 150, y: 140 },
                                                { x: 150, y: 215 },
                                                { x: 190, y: 235 }
                                            ]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Cross left to right in the middle!',
                                            startPoint: { x: 105, y: 130 },
                                            endPoint: { x: 195, y: 130 },
                                            points: [
                                                { x: 105, y: 130 },
                                                { x: 150, y: 130 },
                                                { x: 195, y: 130 }
                                            ]
                                        }
                                    ],
                                    sampleWords: ['tiger', 'tree', 'train']
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // WORLD 2: Valley of Early Blends
    {
        id: 'world-2',
        code: 'W2',
        title: 'Valley of Early Blends',
        description: 'Explore pop plosives and blending sounds: p, i, n!',
        orderIndex: 2,
        themeColor: '#38BDF8',
        accentColor: '#0284C7',
        iconName: 'mountain',
        levels: [
            {
                id: 'level-w2-l4',
                worldId: 'world-2',
                title: 'Sound /p/',
                subtitle: 'The Popping Popcorn',
                soundLabel: 'p',
                orderIndex: 4,
                requiredStars: 3,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w2-l4-t1',
                        levelId: 'level-w2-l4',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /p/',
                        instructionText: 'Hear the crisp popping /p/ sound!',
                        items: [
                            {
                                id: 'item-w2-l4-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'p',
                                targetPhoneme: '/p/',
                                promptText: 'Tap the letter that makes the /p/ sound!',
                                options: [
                                    { id: 'opt-401', label: 'p', isCorrect: true },
                                    { id: 'opt-402', label: 'b', isCorrect: false },
                                    { id: 'opt-403', label: 'd', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w2-l4-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'p',
                                targetPhoneme: '/p/',
                                targetWord: 'Pig',
                                promptText: 'Which picture starts with the /p/ sound?',
                                options: [
                                    { id: 'opt-404', label: '🐷 Pig', isCorrect: true },
                                    { id: 'opt-405', label: '🐱 Cat', isCorrect: false },
                                    { id: 'opt-406', label: '🦆 Duck', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w2-l4-t2',
                        levelId: 'level-w2-l4',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: p',
                        instructionText: 'Pull down below the line, then circle around to the right!',
                        items: [
                            {
                                id: 'item-w2-l4-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'p',
                                targetPhoneme: '/p/',
                                promptText: 'Trace lowercase p: straight down, then round top right!',
                                tracingData: {
                                    grapheme: 'p',
                                    phoneme: '/p/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 110 80 L 110 260 M 110 110 C 140 85 205 85 205 155 C 205 220 140 220 110 195',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Pull straight down below the line!',
                                            startPoint: { x: 110, y: 80 },
                                            endPoint: { x: 110, y: 260 },
                                            points: [{ x: 110, y: 80 }, { x: 110, y: 170 }, { x: 110, y: 260 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Circle around the top right!',
                                            startPoint: { x: 110, y: 110 },
                                            endPoint: { x: 110, y: 195 },
                                            points: [
                                                { x: 110, y: 110 },
                                                { x: 160, y: 95 },
                                                { x: 200, y: 145 },
                                                { x: 160, y: 205 },
                                                { x: 110, y: 195 }
                                            ]
                                        }
                                    ],
                                    sampleWords: ['pig', 'pan', 'pin']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w2-l5',
                worldId: 'world-2',
                title: 'Sound /i/',
                subtitle: 'The Inky Iguana',
                soundLabel: 'i',
                orderIndex: 5,
                requiredStars: 4,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w2-l5-t1',
                        levelId: 'level-w2-l5',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /i/',
                        instructionText: 'Listen for the short /ɪ/ vowel sound!',
                        items: [
                            {
                                id: 'item-w2-l5-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'i',
                                targetPhoneme: '/ɪ/',
                                promptText: 'Tap the letter that makes the /i/ sound!',
                                options: [
                                    { id: 'opt-501', label: 'i', isCorrect: true },
                                    { id: 'opt-502', label: 'e', isCorrect: false },
                                    { id: 'opt-503', label: 'a', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w2-l5-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'i',
                                targetPhoneme: '/ɪ/',
                                targetWord: 'Igloo',
                                promptText: 'Which picture starts with the /i/ sound?',
                                options: [
                                    { id: 'opt-504', label: '🧊 Igloo', isCorrect: true },
                                    { id: 'opt-505', label: '🍎 Apple', isCorrect: false },
                                    { id: 'opt-506', label: '🐘 Elephant', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w2-l5-t2',
                        levelId: 'level-w2-l5',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: i',
                        instructionText: 'Pull down short, then put a dot on top!',
                        items: [
                            {
                                id: 'item-w2-l5-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'i',
                                targetPhoneme: '/ɪ/',
                                promptText: 'Trace lowercase i: straight down, then dot!',
                                tracingData: {
                                    grapheme: 'i',
                                    phoneme: '/ɪ/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 150 120 L 150 230 M 150 75 L 150 85',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Pull straight down!',
                                            startPoint: { x: 150, y: 120 },
                                            endPoint: { x: 150, y: 230 },
                                            points: [{ x: 150, y: 120 }, { x: 150, y: 175 }, { x: 150, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Tap a dot on top!',
                                            startPoint: { x: 150, y: 75 },
                                            endPoint: { x: 150, y: 85 },
                                            points: [{ x: 150, y: 75 }, { x: 150, y: 85 }]
                                        }
                                    ],
                                    sampleWords: ['igloo', 'ink', 'in']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w2-l6',
                worldId: 'world-2',
                title: 'Sound /n/',
                subtitle: 'The Noisy Net',
                soundLabel: 'n',
                orderIndex: 6,
                requiredStars: 5,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w2-l6-t1',
                        levelId: 'level-w2-l6',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /n/',
                        instructionText: 'Hear the nasal /n/ sound!',
                        items: [
                            {
                                id: 'item-w2-l6-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'n',
                                targetPhoneme: '/n/',
                                promptText: 'Tap the letter that makes the /n/ sound!',
                                options: [
                                    { id: 'opt-601', label: 'n', isCorrect: true },
                                    { id: 'opt-602', label: 'u', isCorrect: false },
                                    { id: 'opt-603', label: 'm', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w2-l6-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'pin',
                                targetPhoneme: '/p/ /ɪ/ /n/',
                                targetWord: 'pin',
                                promptText: 'Blend: /p/ + /i/ + /n/! What word does it make?',
                                options: [
                                    { id: 'opt-604', label: 'pin', isCorrect: true },
                                    { id: 'opt-605', label: 'pan', isCorrect: false },
                                    { id: 'opt-606', label: 'tin', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w2-l6-t2',
                        levelId: 'level-w2-l6',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: n',
                        instructionText: 'Pull down, then bounce up over the hill!',
                        items: [
                            {
                                id: 'item-w2-l6-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'n',
                                targetPhoneme: '/n/',
                                promptText: 'Trace lowercase n: straight down, then one hump!',
                                tracingData: {
                                    grapheme: 'n',
                                    phoneme: '/n/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 100 110 L 100 230 M 100 150 C 120 105 190 105 190 150 L 190 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Pull straight down!',
                                            startPoint: { x: 100, y: 110 },
                                            endPoint: { x: 100, y: 230 },
                                            points: [{ x: 100, y: 110 }, { x: 100, y: 170 }, { x: 100, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Hop up and over the hill!',
                                            startPoint: { x: 100, y: 150 },
                                            endPoint: { x: 190, y: 230 },
                                            points: [
                                                { x: 100, y: 150 },
                                                { x: 140, y: 110 },
                                                { x: 190, y: 150 },
                                                { x: 190, y: 230 }
                                            ]
                                        }
                                    ],
                                    sampleWords: ['nest', 'nut', 'net']
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // WORLD 3: Mountain of Makers
    {
        id: 'world-3',
        code: 'W3',
        title: 'Mountain of Makers',
        description: 'Master m, d, g, o and craft fun CVC words!',
        orderIndex: 3,
        themeColor: '#F59E0B',
        accentColor: '#D97706',
        iconName: 'hammer',
        levels: [
            {
                id: 'level-w3-l7',
                worldId: 'world-3',
                title: 'Sound /m/',
                subtitle: 'The Munching Monkey',
                soundLabel: 'm',
                orderIndex: 7,
                requiredStars: 6,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w3-l7-t1',
                        levelId: 'level-w3-l7',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /m/',
                        instructionText: 'Hear the humming /m/ sound!',
                        items: [
                            {
                                id: 'item-w3-l7-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'm',
                                targetPhoneme: '/m/',
                                promptText: 'Tap the letter that makes the /m/ sound!',
                                options: [
                                    { id: 'opt-701', label: 'm', isCorrect: true },
                                    { id: 'opt-702', label: 'w', isCorrect: false },
                                    { id: 'opt-703', label: 'n', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w3-l7-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'm',
                                targetPhoneme: '/m/',
                                targetWord: 'Monkey',
                                promptText: 'Which picture starts with /m/?',
                                options: [
                                    { id: 'opt-704', label: '🐒 Monkey', isCorrect: true },
                                    { id: 'opt-705', label: '🐶 Dog', isCorrect: false },
                                    { id: 'opt-706', label: '🦁 Lion', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w3-l7-t2',
                        levelId: 'level-w3-l7',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: m',
                        instructionText: 'Pull down, then make two humps!',
                        items: [
                            {
                                id: 'item-w3-l7-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'm',
                                targetPhoneme: '/m/',
                                promptText: 'Trace lowercase m: down, then two hills!',
                                tracingData: {
                                    grapheme: 'm',
                                    phoneme: '/m/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 75 110 L 75 230 M 75 150 C 95 105 150 105 150 150 L 150 230 M 150 150 C 170 105 225 105 225 150 L 225 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Pull straight down!',
                                            startPoint: { x: 75, y: 110 },
                                            endPoint: { x: 75, y: 230 },
                                            points: [{ x: 75, y: 110 }, { x: 75, y: 170 }, { x: 75, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Make the first hill!',
                                            startPoint: { x: 75, y: 150 },
                                            endPoint: { x: 150, y: 230 },
                                            points: [{ x: 75, y: 150 }, { x: 110, y: 110 }, { x: 150, y: 150 }, { x: 150, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-3',
                                            instruction: 'Make the second hill!',
                                            startPoint: { x: 150, y: 150 },
                                            endPoint: { x: 225, y: 230 },
                                            points: [{ x: 150, y: 150 }, { x: 185, y: 110 }, { x: 225, y: 150 }, { x: 225, y: 230 }]
                                        }
                                    ],
                                    sampleWords: ['monkey', 'moon', 'mat']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w3-l8',
                worldId: 'world-3',
                title: 'Sound /d/',
                subtitle: 'The Drumming Duck',
                soundLabel: 'd',
                orderIndex: 8,
                requiredStars: 7,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w3-l8-t1',
                        levelId: 'level-w3-l8',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /d/',
                        instructionText: 'Hear the crisp /d/ sound!',
                        items: [
                            {
                                id: 'item-w3-l8-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'd',
                                targetPhoneme: '/d/',
                                promptText: 'Tap the letter that makes the /d/ sound!',
                                options: [
                                    { id: 'opt-801', label: 'd', isCorrect: true },
                                    { id: 'opt-802', label: 'b', isCorrect: false },
                                    { id: 'opt-803', label: 'p', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w3-l8-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'd',
                                targetPhoneme: '/d/',
                                targetWord: 'Duck',
                                promptText: 'Which picture starts with /d/?',
                                options: [
                                    { id: 'opt-804', label: '🦆 Duck', isCorrect: true },
                                    { id: 'opt-805', label: '🐸 Frog', isCorrect: false },
                                    { id: 'opt-806', label: '🐻 Bear', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w3-l8-t2',
                        levelId: 'level-w3-l8',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: d',
                        instructionText: 'Circle around the belly, then pull down tall!',
                        items: [
                            {
                                id: 'item-w3-l8-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'd',
                                targetPhoneme: '/d/',
                                promptText: 'Trace lowercase d: circle left, tall stick down!',
                                tracingData: {
                                    grapheme: 'd',
                                    phoneme: '/d/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 185 130 C 160 95 95 95 95 160 C 95 220 160 220 185 185 M 185 60 L 185 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Circle around the belly to the left!',
                                            startPoint: { x: 185, y: 130 },
                                            endPoint: { x: 185, y: 185 },
                                            points: [{ x: 185, y: 130 }, { x: 135, y: 100 }, { x: 95, y: 160 }, { x: 135, y: 220 }, { x: 185, y: 185 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Pull straight down tall!',
                                            startPoint: { x: 185, y: 60 },
                                            endPoint: { x: 185, y: 230 },
                                            points: [{ x: 185, y: 60 }, { x: 185, y: 145 }, { x: 185, y: 230 }]
                                        }
                                    ],
                                    sampleWords: ['duck', 'drum', 'dog']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w3-l9',
                worldId: 'world-3',
                title: 'Sounds /g/ & /o/',
                subtitle: 'The Giggling Goose & Orange',
                soundLabel: 'g',
                orderIndex: 9,
                requiredStars: 8,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w3-l9-t1',
                        levelId: 'level-w3-l9',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /g/',
                        instructionText: 'Hear the throaty /g/ sound!',
                        items: [
                            {
                                id: 'item-w3-l9-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'g',
                                targetPhoneme: '/ɡ/',
                                promptText: 'Tap the letter that makes the /g/ sound!',
                                options: [
                                    { id: 'opt-901', label: 'g', isCorrect: true },
                                    { id: 'opt-902', label: 'q', isCorrect: false },
                                    { id: 'opt-903', label: 'c', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w3-l9-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'dog',
                                targetPhoneme: '/d/ /ɒ/ /ɡ/',
                                targetWord: 'dog',
                                promptText: 'Blend: /d/ + /o/ + /g/! What word is it?',
                                options: [
                                    { id: 'opt-904', label: 'dog', isCorrect: true },
                                    { id: 'opt-905', label: 'dig', isCorrect: false },
                                    { id: 'opt-906', label: 'tag', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w3-l9-t2',
                        levelId: 'level-w3-l9',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: g',
                        instructionText: 'Circle around, pull down and hook like a fishhook!',
                        items: [
                            {
                                id: 'item-w3-l9-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'g',
                                targetPhoneme: '/ɡ/',
                                promptText: 'Trace lowercase g: circle left, tail hook down!',
                                tracingData: {
                                    grapheme: 'g',
                                    phoneme: '/ɡ/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 185 130 C 160 95 95 95 95 160 C 95 220 160 220 185 185 M 185 100 L 185 240 C 185 270 120 270 100 245',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Circle around!',
                                            startPoint: { x: 185, y: 130 },
                                            endPoint: { x: 185, y: 185 },
                                            points: [{ x: 185, y: 130 }, { x: 135, y: 100 }, { x: 95, y: 160 }, { x: 185, y: 185 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Pull down and hook!',
                                            startPoint: { x: 185, y: 100 },
                                            endPoint: { x: 100, y: 245 },
                                            points: [{ x: 185, y: 100 }, { x: 185, y: 220 }, { x: 155, y: 260 }, { x: 100, y: 245 }]
                                        }
                                    ],
                                    sampleWords: ['goose', 'gift', 'dog']
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // WORLD 4: Forest of Consonants & Digraphs
    {
        id: 'world-4',
        code: 'W4',
        title: 'Forest of Consonants',
        description: 'Explore c, k, e, u, r and unlock advanced blending!',
        orderIndex: 4,
        themeColor: '#8B5CF6',
        accentColor: '#6D28D9',
        iconName: 'tree',
        levels: [
            {
                id: 'level-w4-l10',
                worldId: 'world-4',
                title: 'Sounds /k/ (c & k)',
                subtitle: 'The Clever Cat & Kangaroo',
                soundLabel: 'c',
                orderIndex: 10,
                requiredStars: 9,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w4-l10-t1',
                        levelId: 'level-w4-l10',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /k/',
                        instructionText: 'Hear the clicking /k/ sound made by c and k!',
                        items: [
                            {
                                id: 'item-w4-l10-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'c',
                                targetPhoneme: '/k/',
                                promptText: 'Tap the letter that makes the clicking /k/ sound!',
                                options: [
                                    { id: 'opt-1001', label: 'c', isCorrect: true },
                                    { id: 'opt-1002', label: 's', isCorrect: false },
                                    { id: 'opt-1003', label: 'z', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w4-l10-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'cat',
                                targetPhoneme: '/k/ /æ/ /t/',
                                targetWord: 'cat',
                                promptText: 'Which picture is a /c/ /a/ /t/?',
                                options: [
                                    { id: 'opt-1004', label: '🐱 Cat', isCorrect: true },
                                    { id: 'opt-1005', label: '🐶 Dog', isCorrect: false },
                                    { id: 'opt-1006', label: '🐭 Mouse', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w4-l10-t2',
                        levelId: 'level-w4-l10',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: c',
                        instructionText: 'Curve around to the left like a crescent moon!',
                        items: [
                            {
                                id: 'item-w4-l10-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'c',
                                targetPhoneme: '/k/',
                                promptText: 'Trace lowercase c: curve around like a moon!',
                                tracingData: {
                                    grapheme: 'c',
                                    phoneme: '/k/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 205 110 C 185 85 110 85 95 160 C 95 225 185 225 205 200',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Curve around from right to left!',
                                            startPoint: { x: 205, y: 110 },
                                            endPoint: { x: 205, y: 200 },
                                            points: [{ x: 205, y: 110 }, { x: 145, y: 90 }, { x: 95, y: 160 }, { x: 145, y: 220 }, { x: 205, y: 200 }]
                                        }
                                    ],
                                    sampleWords: ['cat', 'cup', 'cap']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w4-l11',
                worldId: 'world-4',
                title: 'Sound /e/',
                subtitle: 'The Energetic Elephant',
                soundLabel: 'e',
                orderIndex: 11,
                requiredStars: 10,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w4-l11-t1',
                        levelId: 'level-w4-l11',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /e/',
                        instructionText: 'Hear the short /e/ vowel sound!',
                        items: [
                            {
                                id: 'item-w4-l11-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'e',
                                targetPhoneme: '/e/',
                                promptText: 'Tap the letter that makes the /e/ sound!',
                                options: [
                                    { id: 'opt-1101', label: 'e', isCorrect: true },
                                    { id: 'opt-1102', label: 'a', isCorrect: false },
                                    { id: 'opt-1103', label: 'i', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w4-l11-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'pen',
                                targetPhoneme: '/p/ /e/ /n/',
                                targetWord: 'pen',
                                promptText: 'Blend: /p/ + /e/ + /n/! What word is it?',
                                options: [
                                    { id: 'opt-1104', label: 'pen', isCorrect: true },
                                    { id: 'opt-1105', label: 'pan', isCorrect: false },
                                    { id: 'opt-1106', label: 'pin', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w4-l11-t2',
                        levelId: 'level-w4-l11',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: e',
                        instructionText: 'Hit the baseball across, then curve all the way around!',
                        items: [
                            {
                                id: 'item-w4-l11-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'e',
                                targetPhoneme: '/e/',
                                promptText: 'Trace lowercase e: slide across, then curve around!',
                                tracingData: {
                                    grapheme: 'e',
                                    phoneme: '/e/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 105 160 L 195 160 C 195 95 105 95 95 160 C 95 225 185 225 205 200',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Slide right across the middle, then circle up and around!',
                                            startPoint: { x: 105, y: 160 },
                                            endPoint: { x: 205, y: 200 },
                                            points: [
                                                { x: 105, y: 160 },
                                                { x: 195, y: 160 },
                                                { x: 185, y: 105 },
                                                { x: 135, y: 100 },
                                                { x: 95, y: 160 },
                                                { x: 135, y: 220 },
                                                { x: 205, y: 200 }
                                            ]
                                        }
                                    ],
                                    sampleWords: ['egg', 'elephant', 'pen']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w4-l12',
                worldId: 'world-4',
                title: 'Sounds /u/ & /r/',
                subtitle: 'The Umbrella Bird & Rabbit',
                soundLabel: 'u',
                orderIndex: 12,
                requiredStars: 11,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w4-l12-t1',
                        levelId: 'level-w4-l12',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /u/ & /r/',
                        instructionText: 'Hear the short /ʌ/ vowel and roaring /r/!',
                        items: [
                            {
                                id: 'item-w4-l12-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'u',
                                targetPhoneme: '/ʌ/',
                                promptText: 'Tap the letter that makes the /u/ sound!',
                                options: [
                                    { id: 'opt-1201', label: 'u', isCorrect: true },
                                    { id: 'opt-1202', label: 'o', isCorrect: false },
                                    { id: 'opt-1203', label: 'a', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w4-l12-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'run',
                                targetPhoneme: '/r/ /ʌ/ /n/',
                                targetWord: 'run',
                                promptText: 'Blend: /r/ + /u/ + /n/! What word is it?',
                                options: [
                                    { id: 'opt-1204', label: 'run', isCorrect: true },
                                    { id: 'opt-1205', label: 'sun', isCorrect: false },
                                    { id: 'opt-1206', label: 'rug', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w4-l12-t2',
                        levelId: 'level-w4-l12',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace the Letter: u',
                        instructionText: 'Down, curve under, up, and pull down straight!',
                        items: [
                            {
                                id: 'item-w4-l12-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'u',
                                targetPhoneme: '/ʌ/',
                                promptText: 'Trace lowercase u: smile cup, then pull down!',
                                tracingData: {
                                    grapheme: 'u',
                                    phoneme: '/ʌ/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 105 110 L 105 185 C 105 220 185 220 185 185 L 185 110 M 185 150 L 185 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Down and around the cup!',
                                            startPoint: { x: 105, y: 110 },
                                            endPoint: { x: 185, y: 110 },
                                            points: [{ x: 105, y: 110 }, { x: 105, y: 185 }, { x: 145, y: 215 }, { x: 185, y: 185 }, { x: 185, y: 110 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Pull straight down to finish!',
                                            startPoint: { x: 185, y: 150 },
                                            endPoint: { x: 185, y: 230 },
                                            points: [{ x: 185, y: 150 }, { x: 185, y: 230 }]
                                        }
                                    ],
                                    sampleWords: ['umbrella', 'sun', 'run']
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // WORLD 5: Citadel of Consonant Digraphs
    {
        id: 'world-5',
        code: 'W5',
        title: 'Citadel of Digraphs',
        description: 'Master powerful 2-letter digraph sounds: sh, ch, th and become a Phonics Champion!',
        orderIndex: 5,
        themeColor: '#EC4899',
        accentColor: '#BE185D',
        iconName: 'castle',
        levels: [
            {
                id: 'level-w5-l13',
                worldId: 'world-5',
                title: 'Digraph /sh/',
                subtitle: 'The Quiet Shell',
                soundLabel: 'sh',
                orderIndex: 13,
                requiredStars: 12,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w5-l13-t1',
                        levelId: 'level-w5-l13',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /sh/',
                        instructionText: 'Hear the hush-hush /ʃ/ digraph sound in ship and shell!',
                        items: [
                            {
                                id: 'item-w5-l13-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'sh',
                                targetPhoneme: '/ʃ/',
                                promptText: 'Tap the digraph that makes the /sh/ sound!',
                                options: [
                                    { id: 'opt-1301', label: 'sh', isCorrect: true },
                                    { id: 'opt-1302', label: 'ch', isCorrect: false },
                                    { id: 'opt-1303', label: 'th', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w5-l13-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'ship',
                                targetPhoneme: '/ʃ/ /ɪ/ /p/',
                                targetWord: 'ship',
                                promptText: 'Which picture starts with /sh/?',
                                options: [
                                    { id: 'opt-1304', label: '🚢 Ship', isCorrect: true },
                                    { id: 'opt-1305', label: '🚗 Car', isCorrect: false },
                                    { id: 'opt-1306', label: '✈️ Plane', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w5-l13-t2',
                        levelId: 'level-w5-l13',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace Digraph: sh',
                        instructionText: 'Trace s, then trace tall h together!',
                        items: [
                            {
                                id: 'item-w5-l13-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'sh',
                                targetPhoneme: '/ʃ/',
                                promptText: 'Trace the digraph sh!',
                                tracingData: {
                                    grapheme: 'sh',
                                    phoneme: '/ʃ/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 110 120 C 95 90 60 90 50 125 C 40 160 110 170 100 210 C 90 235 50 235 40 215 M 160 70 L 160 230 M 160 150 C 180 110 240 110 240 150 L 240 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Snake curve for s!',
                                            startPoint: { x: 110, y: 120 },
                                            endPoint: { x: 40, y: 215 },
                                            points: [{ x: 110, y: 120 }, { x: 80, y: 95 }, { x: 50, y: 125 }, { x: 80, y: 170 }, { x: 40, y: 215 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Tall stick down for h!',
                                            startPoint: { x: 160, y: 70 },
                                            endPoint: { x: 160, y: 230 },
                                            points: [{ x: 160, y: 70 }, { x: 160, y: 150 }, { x: 160, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-3',
                                            instruction: 'Hump over for h!',
                                            startPoint: { x: 160, y: 150 },
                                            endPoint: { x: 240, y: 230 },
                                            points: [{ x: 160, y: 150 }, { x: 200, y: 115 }, { x: 240, y: 150 }, { x: 240, y: 230 }]
                                        }
                                    ],
                                    sampleWords: ['ship', 'shell', 'fish']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w5-l14',
                worldId: 'world-5',
                title: 'Digraph /ch/',
                subtitle: 'The Cheerful Chimpanzee',
                soundLabel: 'ch',
                orderIndex: 14,
                requiredStars: 13,
                passThresholdScore: 70,
                isTestLevel: false,
                tasks: [
                    {
                        id: 'task-w5-l14-t1',
                        levelId: 'level-w5-l14',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Listen & Pick: /ch/',
                        instructionText: 'Hear the lively /tʃ/ sound in chin and chop!',
                        items: [
                            {
                                id: 'item-w5-l14-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'ch',
                                targetPhoneme: '/tʃ/',
                                promptText: 'Tap the digraph that makes the /ch/ sound!',
                                options: [
                                    { id: 'opt-1401', label: 'ch', isCorrect: true },
                                    { id: 'opt-1402', label: 'sh', isCorrect: false },
                                    { id: 'opt-1403', label: 'th', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w5-l14-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'chip',
                                targetPhoneme: '/tʃ/ /ɪ/ /p/',
                                targetWord: 'chip',
                                promptText: 'Blend: /ch/ + /i/ + /p/! What word is it?',
                                options: [
                                    { id: 'opt-1404', label: 'chip', isCorrect: true },
                                    { id: 'opt-1405', label: 'ship', isCorrect: false },
                                    { id: 'opt-1406', label: 'chin', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w5-l14-t2',
                        levelId: 'level-w5-l14',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace Digraph: ch',
                        instructionText: 'Trace round c, then trace tall h!',
                        items: [
                            {
                                id: 'item-w5-l14-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'ch',
                                targetPhoneme: '/tʃ/',
                                promptText: 'Trace the digraph ch!',
                                tracingData: {
                                    grapheme: 'ch',
                                    phoneme: '/tʃ/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 115 125 C 95 100 50 100 40 150 C 40 200 95 200 115 180 M 160 70 L 160 230 M 160 150 C 180 110 240 110 240 150 L 240 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Round curve for c!',
                                            startPoint: { x: 115, y: 125 },
                                            endPoint: { x: 115, y: 180 },
                                            points: [{ x: 115, y: 125 }, { x: 75, y: 105 }, { x: 40, y: 150 }, { x: 75, y: 195 }, { x: 115, y: 180 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Tall stick down for h!',
                                            startPoint: { x: 160, y: 70 },
                                            endPoint: { x: 160, y: 230 },
                                            points: [{ x: 160, y: 70 }, { x: 160, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-3',
                                            instruction: 'Hump over for h!',
                                            startPoint: { x: 160, y: 150 },
                                            endPoint: { x: 240, y: 230 },
                                            points: [{ x: 160, y: 150 }, { x: 200, y: 115 }, { x: 240, y: 150 }, { x: 240, y: 230 }]
                                        }
                                    ],
                                    sampleWords: ['chin', 'chip', 'chat']
                                }
                            }
                        ]
                    }
                ]
            },
            {
                id: 'level-w5-l15',
                worldId: 'world-5',
                title: 'Grand Master Phonics Quest (/th/)',
                subtitle: 'The Ultimate Phonics Graduation',
                soundLabel: 'th',
                orderIndex: 15,
                requiredStars: 14,
                passThresholdScore: 80,
                isTestLevel: true,
                tasks: [
                    {
                        id: 'task-w5-l15-t1',
                        levelId: 'level-w5-l15',
                        taskType: 'LISTEN_PICK',
                        orderIndex: 1,
                        title: 'Mastery Quiz: Digraph /th/',
                        instructionText: 'Hear the tongue-between-teeth /θ/ sound!',
                        items: [
                            {
                                id: 'item-w5-l15-t1-1',
                                orderIndex: 1,
                                targetGrapheme: 'th',
                                targetPhoneme: '/θ/',
                                promptText: 'Tap the digraph that makes the /th/ sound!',
                                options: [
                                    { id: 'opt-1501', label: 'th', isCorrect: true },
                                    { id: 'opt-1502', label: 'wh', isCorrect: false },
                                    { id: 'opt-1503', label: 'ck', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w5-l15-t1-2',
                                orderIndex: 2,
                                targetGrapheme: 'this',
                                targetPhoneme: '/ð/ /ɪ/ /s/',
                                targetWord: 'this',
                                promptText: 'Blend: /th/ + /i/ + /s/! What word is it?',
                                options: [
                                    { id: 'opt-1504', label: 'this', isCorrect: true },
                                    { id: 'opt-1505', label: 'that', isCorrect: false },
                                    { id: 'opt-1506', label: 'ship', isCorrect: false }
                                ]
                            },
                            {
                                id: 'item-w5-l15-t1-3',
                                orderIndex: 3,
                                targetGrapheme: 'Grand Mastery',
                                targetPhoneme: 'all',
                                targetWord: 'Phonics Champion',
                                promptText: '🏆 Final Challenge: Are you ready to graduate as a Phonics Master?',
                                options: [
                                    { id: 'opt-1507', label: '🌟 YES, I CAN READ!', isCorrect: true },
                                    { id: 'opt-1508', label: 'Need more practice', isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'task-w5-l15-t2',
                        levelId: 'level-w5-l15',
                        taskType: 'TRACE_LETTER',
                        orderIndex: 2,
                        title: 'Trace Digraph: th',
                        instructionText: 'Trace t, then trace h!',
                        items: [
                            {
                                id: 'item-w5-l15-t2-1',
                                orderIndex: 1,
                                targetGrapheme: 'th',
                                targetPhoneme: '/θ/',
                                promptText: 'Trace the digraph th!',
                                tracingData: {
                                    grapheme: 'th',
                                    phoneme: '/θ/',
                                    viewBox: { width: 300, height: 300 },
                                    svgPath: 'M 90 70 L 90 230 M 55 130 L 125 130 M 160 70 L 160 230 M 160 150 C 180 110 240 110 240 150 L 240 230',
                                    guideStrokes: [
                                        {
                                            id: 'stroke-1',
                                            instruction: 'Down and cross for t!',
                                            startPoint: { x: 90, y: 70 },
                                            endPoint: { x: 90, y: 230 },
                                            points: [{ x: 90, y: 70 }, { x: 90, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-2',
                                            instruction: 'Cross the t!',
                                            startPoint: { x: 55, y: 130 },
                                            endPoint: { x: 125, y: 130 },
                                            points: [{ x: 55, y: 130 }, { x: 125, y: 130 }]
                                        },
                                        {
                                            id: 'stroke-3',
                                            instruction: 'Tall stick down for h!',
                                            startPoint: { x: 160, y: 70 },
                                            endPoint: { x: 160, y: 230 },
                                            points: [{ x: 160, y: 70 }, { x: 160, y: 230 }]
                                        },
                                        {
                                            id: 'stroke-4',
                                            instruction: 'Hump over for h!',
                                            startPoint: { x: 160, y: 150 },
                                            endPoint: { x: 240, y: 230 },
                                            points: [{ x: 160, y: 150 }, { x: 200, y: 115 }, { x: 240, y: 150 }, { x: 240, y: 230 }]
                                        }
                                    ],
                                    sampleWords: ['thin', 'this', 'that', 'moth']
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
/** Full curriculum: hand-authored Listen & Pick / Trace tasks plus generated Say the Sound and Blend & Read tasks. */
exports.INITIAL_CURRICULUM = (0, curriculum_words_1.withGeneratedTasks)(BASE_CURRICULUM);
//# sourceMappingURL=curriculum.js.map