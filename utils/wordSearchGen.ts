export const generateWordSearch = (words: string[], size: number) => {
    // Initialize empty grid
    let grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
    const placedWords: any[] = [];
    
    // Sort words by length descending (hardest first)
    const sortedWords = [...words].sort((a, b) => b.length - a.length);

    // Directions: [dRow, dCol]
    // Horizontal, Vertical, Diagonal Down-Right
    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1]   // Diagonal
    ];

    for (const word of sortedWords) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
            attempts++;
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const [dr, dc] = dir;

            // Determine valid start ranges
            // If dr=1, row must be 0 to size - word.length
            // If dc=1, col must be 0 to size - word.length
            const maxRow = dr === 0 ? size : size - word.length;
            const maxCol = dc === 0 ? size : size - word.length;

            if (maxRow < 0 || maxCol < 0) continue; // Word too long for grid

            const r = Math.floor(Math.random() * maxRow);
            const c = Math.floor(Math.random() * maxCol);

            // Check if fits
            let fits = true;
            for (let i = 0; i < word.length; i++) {
                const cellVal = grid[r + i * dr][c + i * dc];
                if (cellVal !== '' && cellVal !== word[i]) {
                    fits = false;
                    break;
                }
            }

            if (fits) {
                // Place it
                const path = [];
                for (let i = 0; i < word.length; i++) {
                    grid[r + i * dr][c + i * dc] = word[i];
                    path.push({ r: r + i * dr, c: c + i * dc });
                }
                placedWords.push({ word, path });
                placed = true;
            }
        }
    }

    // Fill empty spots
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    return { grid, placed: placedWords };
};
