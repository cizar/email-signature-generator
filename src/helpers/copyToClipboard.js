function copyToClipboard (element) {
  if (document.body.createTextRange) {
    let range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
    document.execCommand("Copy");
    document.selection.empty();
  } else if (window.getSelection) {
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy");
    selection.removeAllRanges();
  }
}

export default copyToClipboard;
