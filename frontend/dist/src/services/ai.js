// frontend/src/services/ai.js
// AI service for generating questions and answers - Enhanced with more content

// Mock responses database with expanded content
const mockResponses = {
    'operating system': [
        {
            question: 'What is an Operating System?',
            answer: 'An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between users and the computer hardware. Examples include Windows, macOS, Linux, and Android.'
        },
        {
            question: 'What are the main functions of an Operating System?',
            answer: 'The main functions include: Process Management (CPU scheduling), Memory Management (allocation and deallocation), File System Management (organizing files), Device Management (handling I/O operations), Security (protecting resources), and User Interface (providing interaction methods).'
        },
        {
            question: 'What are the types of Operating Systems?',
            answer: 'Common types include: Batch OS (processes jobs in batches), Time-sharing OS (multiple users share CPU time), Distributed OS (multiple computers work together), Network OS (manages network resources), Real-time OS (time-critical systems like medical devices), and Mobile OS (smartphones and tablets).'
        },
        {
            question: 'What is the difference between 32-bit and 64-bit operating systems?',
            answer: '32-bit OS can address up to 4GB of RAM, while 64-bit OS can address theoretically up to 16.8 million TB of RAM. 64-bit systems handle larger amounts of memory more efficiently and are required for modern applications. Most computers today use 64-bit operating systems.'
        },
        {
            question: 'What is virtual memory?',
            answer: 'Virtual memory is a memory management technique that creates an illusion of more RAM than physically available. It uses disk space as an extension of RAM, allowing programs to run even if they require more memory than physically available. This improves multitasking but can slow down performance if overused.'
        },
        {
            question: 'What is a process in operating systems?',
            answer: 'A process is a program in execution. It includes the program code, current activity, stack, data section, and program counter. Processes go through various states: new, ready, running, waiting, and terminated. The OS manages processes through scheduling algorithms.'
        },
        {
            question: 'What is scheduling in OS?',
            answer: 'Scheduling is the method by which processes are assigned to CPU time. Common scheduling algorithms include: First Come First Serve (FCFS), Shortest Job First (SJF), Round Robin (RR), Priority Scheduling, and Multi-level Queue Scheduling. The goal is to maximize CPU utilization and throughput.'
        },
        {
            question: 'What is a deadlock?',
            answer: 'A deadlock occurs when two or more processes are unable to proceed because each is waiting for resources held by the others. Four conditions must hold for deadlock: mutual exclusion, hold and wait, no preemption, and circular wait. Prevention, avoidance, detection, and recovery are strategies to handle deadlocks.'
        },
        {
            question: 'What is the kernel of an operating system?',
            answer: 'The kernel is the core component of an OS that manages system resources and communication between hardware and software. It provides the lowest-level abstraction layer for resources, including memory, processors, and I/O devices. Types include monolithic kernels, microkernels, and hybrid kernels.'
        },
        {
            question: 'What is the difference between multitasking and multiprocessing?',
            answer: 'Multitasking refers to running multiple tasks concurrently on a single CPU through time-sharing. Multiprocessing uses multiple CPUs or cores to execute multiple processes simultaneously. Modern systems combine both: multiprocessing hardware with multitasking software for optimal performance.'
        }
    ],
    'database': [
        {
            question: 'What is a Database?',
            answer: 'A database is an organized collection of structured information, or data, typically stored electronically in a computer system. It is controlled by a Database Management System (DBMS) which allows users to create, read, update, and delete data efficiently.'
        },
        {
            question: 'What is SQL?',
            answer: 'SQL (Structured Query Language) is a programming language designed for managing data in relational database management systems. It is used for querying, updating, inserting, and deleting data. Common commands include SELECT, INSERT, UPDATE, DELETE, JOIN, and CREATE TABLE.'
        },
        {
            question: 'What is the difference between SQL and NoSQL?',
            answer: 'SQL databases are relational, use structured schemas, support complex queries, and ensure ACID compliance. NoSQL databases are non-relational, have flexible schemas, scale horizontally easily, and are better for handling large volumes of unstructured data like JSON documents, key-value pairs, or graphs.'
        },
        {
            question: 'What is a primary key?',
            answer: 'A primary key is a unique identifier for each record in a database table. It must contain unique values and cannot be NULL. A table can have only one primary key, which can consist of single or multiple columns (composite key). Primary keys are essential for establishing relationships between tables.'
        },
        {
            question: 'What is a foreign key?',
            answer: 'A foreign key is a column or set of columns in a table that refers to the primary key of another table. It establishes a link between two tables, enforcing referential integrity. Foreign keys ensure that relationships between tables remain consistent, preventing orphaned records.'
        },
        {
            question: 'What are the ACID properties?',
            answer: 'ACID stands for Atomicity (transactions are all-or-nothing), Consistency (transactions maintain data integrity), Isolation (concurrent transactions don\'t interfere), and Durability (committed transactions persist). These properties ensure reliable processing of database transactions.'
        },
        {
            question: 'What is normalization?',
            answer: 'Normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them. Normal forms include 1NF, 2NF, 3NF, BCNF, and higher levels, each addressing specific types of redundancy.'
        },
        {
            question: 'What is indexing in databases?',
            answer: 'Indexing is a data structure technique that improves the speed of data retrieval operations. Indexes work like book indexes, allowing the database to find data without scanning every row. While indexes speed up SELECT queries, they can slow down INSERT, UPDATE, and DELETE operations.'
        },
        {
            question: 'What is a JOIN in SQL?',
            answer: 'A JOIN clause combines rows from two or more tables based on a related column. Types include: INNER JOIN (returns matching rows), LEFT JOIN (returns all rows from left table), RIGHT JOIN (returns all rows from right table), FULL OUTER JOIN (returns all rows from both tables), and CROSS JOIN (Cartesian product).'
        },
        {
            question: 'What is database transaction?',
            answer: 'A transaction is a unit of work performed against a database. It consists of one or more operations that must be executed atomically. Transactions follow ACID properties and are managed using commands like BEGIN TRANSACTION, COMMIT, and ROLLBACK to ensure data consistency.'
        }
    ],
    'python': [
        {
            question: 'What is Python?',
            answer: 'Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, it supports multiple programming paradigms (object-oriented, functional, procedural) and has extensive library support for web development, data science, AI, and automation.'
        },
        {
            question: 'What are Python decorators?',
            answer: 'Decorators are functions that modify the behavior of other functions. They wrap another function to extend its functionality without permanently modifying it. Example: @timer def my_func(): pass would measure execution time. Decorators use the @ symbol and are commonly used for logging, timing, and access control.'
        },
        {
            question: 'What are list comprehensions in Python?',
            answer: 'List comprehensions provide a concise way to create lists based on existing iterables. Syntax: [expression for item in iterable if condition]. Example: [x**2 for x in range(10) if x % 2 == 0] creates a list of squares of even numbers. They are more readable and often faster than traditional loops.'
        },
        {
            question: 'What is the difference between Python lists and tuples?',
            answer: 'Lists are mutable (can be changed after creation) and use square brackets []. Tuples are immutable (cannot be changed) and use parentheses (). Lists have methods like append(), remove(), and extend(). Tuples are faster and can be used as dictionary keys due to their immutability.'
        },
        {
            question: 'What are Python generators?',
            answer: 'Generators are functions that yield values one at a time using the yield keyword, instead of returning all at once. They produce values lazily, saving memory when working with large datasets. Generators maintain their state between yields and can be used in loops.'
        },
        {
            question: 'What is the Global Interpreter Lock (GIL) in Python?',
            answer: 'The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode simultaneously. While it simplifies memory management, it can be a bottleneck for CPU-bound multi-threaded programs. For I/O-bound tasks, threading works well; for CPU-bound tasks, multiprocessing is recommended.'
        },
        {
            question: 'What are Python\'s built-in data structures?',
            answer: 'Python\'s built-in data structures include: Lists (ordered, mutable), Tuples (ordered, immutable), Dictionaries (key-value pairs, unordered), Sets (unique elements, unordered), and Strings (immutable sequences). Each has its own methods and use cases for efficient data handling.'
        },
        {
            question: 'What is virtual environment in Python?',
            answer: 'A virtual environment is an isolated Python environment that allows you to manage dependencies for different projects separately. It prevents version conflicts by creating project-specific installations of packages. Tools like venv (built-in) and virtualenv are commonly used for environment management.'
        },
        {
            question: 'What are Python\'s magic methods?',
            answer: 'Magic methods (dunder methods) are special methods with double underscores, like __init__, __str__, __len__, __add__. They allow classes to define behavior for built-in operations. Implementing these methods enables objects to work with Python\'s native features like iteration, context managers, and arithmetic operators.'
        },
        {
            question: 'What is the difference between deep copy and shallow copy?',
            answer: 'Shallow copy creates a new object but inserts references to the original nested objects. Deep copy creates a completely independent copy with all nested objects recursively copied. Use copy.copy() for shallow copy and copy.deepcopy() for deep copy. Deep copy is safer but more memory-intensive.'
        }
    ],
    'javascript': [
        {
            question: 'What is JavaScript?',
            answer: 'JavaScript is a high-level, interpreted programming language that is a core technology of the World Wide Web, alongside HTML and CSS. It enables interactive web pages and is an essential part of web applications. It supports event-driven, functional, and imperative programming styles.'
        },
        {
            question: 'What is closure in JavaScript?',
            answer: 'A closure is a function that has access to its outer function scope even after the outer function has returned. It allows private variables and data encapsulation. Example: function outer() { let x = 10; return function inner() { return x; } } - inner() retains access to x even after outer() executes.'
        },
        {
            question: 'What is hoisting in JavaScript?',
            answer: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their containing scope during compilation. var declarations are hoisted and initialized with undefined, while let and const are hoisted but not initialized (Temporal Dead Zone). Function declarations are fully hoisted, allowing them to be called before definition.'
        },
        {
            question: 'What is the difference between == and ===?',
            answer: '== (abstract equality) performs type coercion before comparison, converting values to the same type. === (strict equality) compares both value and type without coercion. Example: 1 == "1" returns true, but 1 === "1" returns false. It\'s recommended to use === to avoid unexpected type coercion bugs.'
        },
        {
            question: 'What are promises in JavaScript?',
            answer: 'Promises are objects representing the eventual completion or failure of asynchronous operations. They have three states: pending, fulfilled, and rejected. Methods include .then() for success, .catch() for errors, and .finally() for cleanup. Promises allow chaining and better error handling than callbacks.'
        },
        {
            question: 'What is async/await?',
            answer: 'async/await is syntactic sugar built on Promises that makes asynchronous code look synchronous. The async keyword declares an asynchronous function that returns a Promise. The await keyword pauses execution until the Promise resolves. This improves readability and error handling with try/catch blocks.'
        },
        {
            question: 'What is the event loop in JavaScript?',
            answer: 'The event loop is JavaScript\'s concurrency model that enables non-blocking I/O operations. It continuously checks the call stack and task queue, pushing pending tasks to the stack when it\'s empty. This allows JavaScript to handle asynchronous operations efficiently despite being single-threaded.'
        },
        {
            question: 'What are arrow functions?',
            answer: 'Arrow functions provide a concise syntax for writing functions using the => operator. They have lexical this binding, meaning this refers to the surrounding context. They cannot be used as constructors, don\'t have their own arguments object, and are best suited for non-method functions.'
        },
        {
            question: 'What is the spread operator?',
            answer: 'The spread operator (...) allows iterable elements to be expanded in places like function calls, array literals, and object literals. Examples: [...arr] copies an array, {...obj} creates a shallow copy of an object, and Math.max(...numbers) passes array elements as arguments. It\'s useful for immutability.'
        },
        {
            question: 'What is destructuring in JavaScript?',
            answer: 'Destructuring is a syntax that extracts values from arrays or properties from objects into distinct variables. Array destructuring: [a, b] = [1, 2]. Object destructuring: {name, age} = person. It supports default values, renaming, and nested structures, making code more concise and readable.'
        }
    ],
    'machine learning': [
        {
            question: 'What is Machine Learning?',
            answer: 'Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves. Types include supervised learning, unsupervised learning, and reinforcement learning.'
        },
        {
            question: 'What is supervised learning?',
            answer: 'Supervised learning is a type of machine learning where the model is trained on labeled data. The algorithm learns to map input to output based on example input-output pairs. Common algorithms include Linear Regression, Decision Trees, Random Forest, and Neural Networks. Applications include classification and regression tasks.'
        },
        {
            question: 'What is unsupervised learning?',
            answer: 'Unsupervised learning involves training models on unlabeled data to discover hidden patterns or intrinsic structures. Common techniques include clustering (K-means, hierarchical), dimensionality reduction (PCA, t-SNE), and association rule mining. Applications include customer segmentation, anomaly detection, and feature learning.'
        },
        {
            question: 'What is reinforcement learning?',
            answer: 'Reinforcement learning is an area of ML where an agent learns to make decisions by taking actions in an environment to maximize cumulative reward. The agent learns through trial and error, receiving feedback through rewards or penalties. Applications include game playing (AlphaGo), robotics, and autonomous vehicles.'
        },
        {
            question: 'What is overfitting and underfitting?',
            answer: 'Overfitting occurs when a model learns training data too well, including noise and outliers, resulting in poor generalization to new data. Underfitting occurs when a model is too simple to capture underlying patterns. The goal is to find a balance through techniques like cross-validation, regularization, and appropriate model complexity.'
        },
        {
            question: 'What is a neural network?',
            answer: 'A neural network is a computing system inspired by biological neural networks. It consists of layers of interconnected nodes (neurons) that process information. Neural networks can learn complex patterns through forward propagation and backpropagation. Types include feedforward, convolutional (CNN), recurrent (RNN), and transformer networks.'
        },
        {
            question: 'What is deep learning?',
            answer: 'Deep learning is a subset of machine learning using neural networks with multiple hidden layers (deep neural networks). It automatically learns hierarchical feature representations from raw data. Deep learning has revolutionized computer vision, natural language processing, and speech recognition through architectures like CNNs, RNNs, and Transformers.'
        },
        {
            question: 'What is the difference between classification and regression?',
            answer: 'Classification predicts discrete categories or labels (e.g., spam/not spam, cat/dog). Regression predicts continuous numerical values (e.g., house prices, temperature). Classification uses accuracy, precision, recall for evaluation, while regression uses MSE, RMSE, R-squared. Both are types of supervised learning.'
        },
        {
            question: 'What is the bias-variance tradeoff?',
            answer: 'The bias-variance tradeoff describes the tension between model complexity and generalization. High bias leads to underfitting (too simple), while high variance leads to overfitting (too complex). The goal is to find the sweet spot that minimizes total error. Regularization techniques help manage this tradeoff.'
        },
        {
            question: 'What is cross-validation?',
            answer: 'Cross-validation is a resampling technique for evaluating model performance on limited data. K-fold cross-validation splits data into k subsets, training on k-1 folds and validating on the remaining fold, repeating k times. This provides a more robust estimate of model performance than a single train-test split.'
        }
    ],
    'artificial intelligence': [
        {
            question: 'What is Artificial Intelligence?',
            answer: 'Artificial Intelligence (AI) is the simulation of human intelligence in machines programmed to think and learn. It encompasses various subfields including machine learning, natural language processing, computer vision, robotics, and expert systems. AI aims to create systems that can perform tasks that normally require human intelligence.'
        },
        {
            question: 'What is the difference between AI, ML, and DL?',
            answer: 'AI is the broadest concept encompassing any technique enabling machines to mimic human intelligence. Machine Learning is a subset of AI focused on algorithms that learn from data. Deep Learning is a subset of ML using neural networks with multiple layers. Think of it as AI > ML > DL, each nested within the previous.'
        },
        {
            question: 'What is Natural Language Processing (NLP)?',
            answer: 'NLP is a branch of AI that enables computers to understand, interpret, and generate human language. Applications include machine translation, sentiment analysis, chatbots, speech recognition, and text summarization. Modern NLP uses transformer architectures like BERT and GPT for state-of-the-art results.'
        },
        {
            question: 'What is Computer Vision?',
            answer: 'Computer vision is a field of AI that enables machines to interpret and understand visual information from the world. Applications include image classification, object detection, facial recognition, autonomous vehicles, and medical imaging analysis. Deep learning, especially CNNs, has revolutionized computer vision capabilities.'
        },
        {
            question: 'What are Large Language Models (LLMs)?',
            answer: 'LLMs are AI models trained on vast amounts of text data to understand and generate human-like text. Examples include GPT, BERT, and LLaMA. They use transformer architecture and attention mechanisms to capture context. Applications include chatbots, content generation, code completion, and question answering.'
        },
        {
            question: 'What is ethical AI?',
            answer: 'Ethical AI focuses on developing AI systems that are fair, transparent, accountable, and respect user privacy. Key concerns include bias in algorithms, explainability of decisions, data privacy, and the societal impact of automation. Ethical frameworks and regulations aim to ensure AI benefits humanity responsibly.'
        }
    ],
    'data structures': [
        {
            question: 'What are the fundamental data structures?',
            answer: 'Fundamental data structures include arrays, linked lists, stacks, queues, trees, graphs, hash tables, and heaps. Each has unique properties, strengths, and weaknesses. Choosing the right data structure for a problem is crucial for algorithm efficiency and code maintainability.'
        },
        {
            question: 'What is the difference between array and linked list?',
            answer: 'Arrays store elements in contiguous memory, allowing O(1) random access but O(n) insertion/deletion. Linked lists store elements in nodes with pointers, allowing O(1) insertion/deletion at ends but O(n) access. Arrays have fixed size (static arrays), while linked lists can grow dynamically.'
        },
        {
            question: 'What is a stack?',
            answer: 'A stack is a linear data structure following Last-In-First-Out (LIFO) principle. Operations include push (add), pop (remove), and peek (view top). Stacks are used in function call management, expression evaluation, undo/redo features, and backtracking algorithms. They can be implemented with arrays or linked lists.'
        },
        {
            question: 'What is a queue?',
            answer: 'A queue is a linear data structure following First-In-First-Out (FIFO) principle. Operations include enqueue (add to back), dequeue (remove from front), and peek (view front). Variants include circular queues, priority queues, and dequeues (double-ended). Used in task scheduling, breadth-first search, and buffer management.'
        },
        {
            question: 'What is a binary search tree?',
            answer: 'A binary search tree (BST) is a tree data structure where each node has at most two children. Left subtree contains nodes with smaller values, right subtree contains larger values. Operations (search, insert, delete) average O(log n) time. Balanced BSTs like AVL and Red-Black trees maintain O(log n) performance.'
        },
        {
            question: 'What is a hash table?',
            answer: 'A hash table is a data structure implementing an associative array, mapping keys to values. It uses a hash function to compute an index into an array of buckets. Average time complexity for operations is O(1). Collision resolution techniques include chaining and open addressing. Used in databases, caches, and symbol tables.'
        }
    ],
    'algorithms': [
        {
            question: 'What is Big O notation?',
            answer: 'Big O notation describes the asymptotic upper bound of an algorithm\'s time or space complexity. It measures how runtime or memory scales with input size, ignoring constants. Common complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2^n) exponential.'
        },
        {
            question: 'What are sorting algorithms?',
            answer: 'Sorting algorithms arrange elements in a specific order. Common sorts: Quick Sort (average O(n log n)), Merge Sort (O(n log n) stable), Bubble Sort (O(n²) simple), Insertion Sort (efficient for small datasets), Heap Sort (O(n log n) in-place), and Radix Sort (linear time for integers).'
        },
        {
            question: 'What is binary search?',
            answer: 'Binary search is an efficient algorithm for finding elements in sorted arrays. It repeatedly divides the search interval in half, comparing the target to the middle element. Time complexity is O(log n), making it much faster than linear search for large datasets. Requires the array to be sorted.'
        },
        {
            question: 'What are graph algorithms?',
            answer: 'Graph algorithms solve problems on graph structures. Key algorithms include: Dijkstra\'s (shortest path), Bellman-Ford (shortest path with negative weights), Floyd-Warshall (all-pairs shortest path), Kruskal\'s and Prim\'s (minimum spanning tree), Topological Sort (ordering DAG nodes), and DFS/BFS (traversal).'
        }
    ]
};

// Default response for unknown topics
const defaultResponse = [
    {
        question: 'What is this topic about?',
        answer: 'This topic covers fundamental concepts and principles in its field. It involves understanding core theories, practical applications, and modern developments in the area. To learn more, consider breaking down the topic into smaller subtopics and exploring each systematically.'
    },
    {
        question: 'Why is this topic important?',
        answer: 'This topic plays a crucial role in technology and science by providing solutions to complex problems and enabling efficient system design and implementation. Understanding it helps in building better applications, solving real-world problems, and advancing innovation in the field.'
    },
    {
        question: 'What are the key concepts?',
        answer: 'Key concepts include theoretical foundations, practical applications, industry standards, and emerging trends that shape the understanding and implementation of this topic. Further research and study will reveal more specific details based on your interests and goals.'
    },
    {
        question: 'How can I learn more about this topic?',
        answer: 'To learn more, start with foundational resources like online courses, textbooks, and tutorials. Practice with hands-on projects, join communities, and follow experts in the field. Break complex concepts into smaller parts and build your knowledge progressively.'
    },
    {
        question: 'What are common applications of this topic?',
        answer: 'Common applications vary based on the specific subject but typically include real-world implementations, problem-solving scenarios, and innovative solutions. Practical experience through projects is one of the best ways to understand applications.'
    }
];

// Generate Q&A based on topic
export async function generateQA(topic) {
    // Simulate API delay (reduced for better UX)
    await new Promise(resolve => setTimeout(resolve, 800));
    
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

// Get number of questions available for a topic
export function getQuestionCount(topic) {
    const normalizedTopic = topic.toLowerCase().trim();
    for (const [key, value] of Object.entries(mockResponses)) {
        if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
            return value.length;
        }
    }
    return defaultResponse.length;
}

// Get all available topics
export function getAvailableTopics() {
    return Object.keys(mockResponses);
}