// AI service for generating questions and answers

// Mock responses database
const mockResponses = {
    'operating system': [
        {
            question: 'What is an Operating System?',
            answer: 'An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between users and the computer hardware.'
        },
        {
            question: 'What are the main functions of an Operating System?',
            answer: 'The main functions include: Process Management, Memory Management, File System Management, Device Management, Security, and User Interface. These functions ensure efficient and secure operation of computer systems.'
        },
        {
            question: 'What are the types of Operating Systems?',
            answer: 'Common types include: Batch OS, Time-sharing OS, Distributed OS, Network OS, and Real-time OS. Each type serves different purposes and use cases in computing environments.'
        }
    ],
    'database': [
        {
            question: 'What is a Database?',
            answer: 'A database is an organized collection of structured information, or data, typically stored electronically in a computer system. It is usually controlled by a Database Management System (DBMS).'
        },
        {
            question: 'What is SQL?',
            answer: 'SQL (Structured Query Language) is a programming language designed for managing data in relational database management systems. It is used for querying, updating, and managing data.'
        },
        {
            question: 'What is the difference between SQL and NoSQL?',
            answer: 'SQL databases are relational, use structured schema, and are best for complex queries. NoSQL databases are non-relational, flexible, and better for handling large volumes of unstructured data.'
        }
    ],
    'python': [
        {
            question: 'What is Python?',
            answer: 'Python is a high-level, interpreted programming language known for its simplicity and readability. It supports multiple programming paradigms and has extensive library support.'
        },
        {
            question: 'What are Python decorators?',
            answer: 'Decorators are functions that modify the behavior of other functions. They wrap another function to extend its functionality without permanently modifying it.'
        }
    ],
    'javascript': [
        {
            question: 'What is JavaScript?',
            answer: 'JavaScript is a high-level, interpreted programming language that is a core technology of the World Wide Web, alongside HTML and CSS. It enables interactive web pages.'
        },
        {
            question: 'What is closure in JavaScript?',
            answer: 'A closure is a function that has access to its outer function scope even after the outer function has returned. It allows private variables and data encapsulation.'
        }
    ],
    'machine learning': [
        {
            question: 'What is Machine Learning?',
            answer: 'Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves.'
        },
        {
            question: 'What is supervised learning?',
            answer: 'Supervised learning is a type of machine learning where the model is trained on labeled data. The algorithm learns to map input to output based on example input-output pairs.'
        }
    ]
};

// Default response for unknown topics
const defaultResponse = [
    {
        question: 'What is this topic about?',
        answer: 'This topic covers fundamental concepts and principles in its field. It involves understanding core theories, practical applications, and modern developments in the area.'
    },
    {
        question: 'Why is this topic important?',
        answer: 'This topic plays a crucial role in technology and science by providing solutions to complex problems and enabling efficient system design and implementation.'
    },
    {
        question: 'What are the key concepts?',
        answer: 'Key concepts include theoretical foundations, practical applications, industry standards, and emerging trends that shape the understanding and implementation of this topic.'
    }
];

// Generate Q&A based on topic
export async function generateQA(topic) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Normalize topic for matching
    const normalizedTopic = topic.toLowerCase().trim();
    
    // Find matching response
    let response = null;
    for (const [key, value] of Object.entries(mockResponses)) {
        if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
            response = value;
            break;
        }
    }
    
    // Return topic-specific or default response
    return response || defaultResponse;
}