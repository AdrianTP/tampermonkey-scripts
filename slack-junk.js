// ICONS:
// c-icon--:
// - \E004 'comment-alt' (chat bubble, lines, light) and \E518 'comment' (chat bubble, lines, dark)
// - \E005 'comment-o' (chat bubble, empty, light)
// - \E00B 'clear' (broom, light)
// - \E00C 'channels' (rectangle with list, light) and \E52A 'channels-filled' (rectangle with list, dark)
// - \E00D 'dm' (two chat bubbles, light) and \E52B 'dm-filled' (two chat bubbles, dark)
// - \E011 'bolt' (bolt, light) and \E586 'bolt-filled' (bolt, dark)
// - \E019 'cloud-download' (cloud download, light)
// - \E026 'magic' (magic wand, light)
// - \E123 'sparkles' (magic sparkles, light) and \E564 'sparkles-filled' (magic sparkles, dark)
// - \E028 'external-link-square' (square with ne arrow inside, light) and \E505 'external-link-large' (square with ne arrow inside, dark)
// - \E033 'archive' (box, closed, light) and \E093 'unarchive' (box, open, light)
// - \E036 'book' (book, light)
// - \E041 'paper-plane' (paper airplane, light)
//***\E046 'print' (printer, light)
// - \E047 'quote-o' (quote, light) and \E516 'quote' (quote, dark)
// - \E049 'eye' (eye, open, light) and \E050 'eye-closed' (eye, closed, light) and \E584 'eye-filled' (eye, open, dark)
// - \E058 'file' (document, folded, empty, light)
// - \E059 'all-files' (double document, folded, empty, light)
// - \E05A 'post-object' (paragraph lines)
// - \E05C 'file-wo' (document, empty, thick lines, light) and \E544 'file-wo-filled' (document, empty, thick lines, dark)
// - \E05D 'file-large'wo' (document, empty, thin lines, light) and \E545 'file-large-wo-filled' (document, empty, thin lines, dark)
// - \E072 'repeat' (cw arrow, empty, light)
//***\E075 'undo' (ccw arrow, dashed tail, empty, light) and \E076 'history' (ccw arrow, dashed tail, clock, light)
// - \E079 'clock-o' (clock, light)
// - \E098 'feedback' (chat bubble with cw arrow, light)
// - \E0A4 'checkbox-empty' (rounded square, empty, light)
// - \E101 'save' (rectangle with downward arrow entering, light)
// - \E103 'list' (paragraph lines, smaller, light)
// - \E105 'share-other-alt' (slack logo with curved right arrow, light)
// - \E112 'create-post' (document, lines, light)
// - \E113 'upload' (document with up arrow, folded, empty, light)
//***\E114 'download' (document with downward arrow, folded, empty, light)
// - \E120 'quote-post' (weird paragraph lines thing, light)
// - \E134 'play' (play button, light) and \E539 'play-filled' (play button, dark)
// - \E137 'poo' (poop emoji, light) and \E529 'poo-filled' (poop emoji, dark)
// - \E142 'grabby-patty' (three horizontal lines, light)
// - \E153 'new-window' (two layered rectangles, light)
// - \E159 'menu' (uneven horizontal lines, light)
// - \E191 'mark-unread' (horizontal lines with arrow pointing to a specific line, light)
// - \E193 'invoice' (receipt, torn, light)
// - \E224 'circle-small' (circle, smaller, light)
//***\E225 'circle-large' (circle, light) and \E234 'square-times' (rounded square with x inside, light)
// - \E225 'circle-large' (circle, light) and \E530 'circle-fill' (circle, dark)
// - \E322 'real-checkbox-empty' (rounded square, light) and \E325 'circle-checkbox-empty' (circle, light)
// - \E400 'file-generic' (document, folded, empty, light)
// - \E401 'file-generic-small' (document, folded, empty, thicker lines, light)
// - \E420 'file-media-archive' (document, target/cd, light) or \E421 'file-media-archive-small' (document, target/cd, thicker lines, light)
// - \E700 'form-checkbox-empty' (rounded square, light) and \E701 'form-checkbox-checked' (rounded square, dark)
// - \E702 'form-radio-empty' (circle, light) and \E703 'form-radio-checked' (circle, dark)
//***\E703 'form-radio-checked' (circle, dark) and \E701 'form-checkbox-checked' (rounded square, dark)
//***\E225 'circle-large' (circle, light) and \E548 'close-filled' (circle, x, dark)

// FAVOURITES:
// \E046 'print' (printer, light)
// \E075 'undo' (ccw arrow, dashed tail, empty, light) and \E076 'history' (ccw arrow, dashed tail, clock, light)
// \E114 'download' (document with downward arrow, folded, empty, light)
// \E225 'circle-large' (circle, light) and \E234 'square-times' (rounded square with x inside, light)
// \E703 'form-radio-checked' (circle, dark) and \E701 'form-checkbox-checked' (rounded square, dark)
// \E225 'circle-large' (circle, light) and \E548 'close-filled' (circle, x, dark)

// SELECTORS:
//    SLACK_EVENT_TARGET_SELECTOR = '[data-qa="message_pane"] [data-qa="slack_kit_scrollbar"].c-scrollbar__hider',
//    SLACK_EXPAND_TRIGGER_SELECTOR = '[data-qa="message_pane"] .expand-trigger',

// FAILED HACKING:
//    triggerScroll = function triggerScroll() {
//      var target = document.querySelector(SLACK_EXPAND_TRIGGER_SELECTOR),
//        fakeEventHash = {
//          currentTarget: document,
//          srcElement: target,
//          target: target,
//          type: 'scroll'
//        },
//        fakeEventInstance = new Event('scroll', fakeEventHash);
//
//      target.dispatchEvent(fakeEventInstance);
//    },
