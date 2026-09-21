function stripAnsi(str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1b\[[0-9;]*m/g, "");
}
function isWide(codePoint) {
    return ((codePoint >= 0x1100 && codePoint <= 0x115f) || // Hangul Jamo
        (codePoint >= 0x2e80 && codePoint <= 0xa4cf) || // CJK Radicals ~ Yi
        (codePoint >= 0xac00 && codePoint <= 0xd7a3) || // Hangul Syllables
        (codePoint >= 0xf900 && codePoint <= 0xfaff) || // CJK Compatibility Ideographs
        (codePoint >= 0xff00 && codePoint <= 0xff60) || // Fullwidth Forms
        (codePoint >= 0xffe0 && codePoint <= 0xffe6) ||
        (codePoint >= 0x1f300 && codePoint <= 0x1faff) || // Emoji / symbols
        (codePoint >= 0x20000 && codePoint <= 0x3fffd) // CJK Extension B+
    );
}
export function visibleWidth(str) {
    const plain = stripAnsi(str);
    let width = 0;
    for (const char of plain) {
        width += isWide(char.codePointAt(0) ?? 0) ? 2 : 1;
    }
    return width;
}
