# simple for using jwt token

const token = req.headers.authorization.split(' ')[1]; const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); const userId = decodedToken.userId; if (req.body.userId && req.body.userId !== userId) { throw 'Invalid user ID'; } else { next(); }
