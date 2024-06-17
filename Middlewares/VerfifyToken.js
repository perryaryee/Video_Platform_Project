import jwt from 'jsonwebtoken';



// const blacklistedTokens = new Set();

// const auth_security = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized: Access Denied' });
//     }

//     if (blacklistedTokens.has(token)) {
//         return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }
// };

// export { auth_security, blacklistedTokens };


// const blacklistedTokens = new Set();

// const auth_security = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//     console.log('Token:', token); // Debug log

//     if (!token) {
//         console.log('No token provided'); // Debug log
//         return res.status(401).json({ message: 'Unauthorized: Access Denied' });
//     }

//     if (blacklistedTokens.has(token)) {
//         console.log('Token is blacklisted'); // Debug log
//         return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded:', decoded); // Debug log
//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.log('Invalid token', err); // Debug log
//         return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }
// };

// export { auth_security, blacklistedTokens };

const blacklistedTokens = new Set();

const auth_security = (req, res, next) => {
    console.log('Headers:', req.headers); // Debug log all headers
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token); // Debug log the token

    if (!token) {
        console.log('No token provided'); // Debug log
        return res.status(401).json({ message: 'Unauthorized: Access Denied' });
    }

    if (blacklistedTokens.has(token)) {
        console.log('Token is blacklisted'); // Debug log
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded); // Debug log
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Invalid token', err); // Debug log
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


export { auth_security, blacklistedTokens };