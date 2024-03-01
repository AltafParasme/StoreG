function titleCaseConvertor(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  
  function snakeCaseToTitleCase(word: string) {
    return word
      .split('_')
      .map(w => titleCaseConvertor(w))
      .join(' ');
  }
  
  export function convertWordToTitleCase(word) {
    if (!word || typeof word !== 'string') {
      return word;
    }
    if (/^[a-zA-Z0-9,-/\\]+$/.test(word)) {
      return titleCaseConvertor(word);
    }
    if (/^[a-zA-Z0-9_]+$/.test(word)) {
      return snakeCaseToTitleCase(word);
    }
    return titleCaseConvertor(word);
  }
  
  export function convertTextToTitleCase(text: string) {
    if(!text || typeof text !== 'string'){
      return text;
    }
    return text
      .split(' ')
      .map(word => convertWordToTitleCase(word))
      .join(' ');
  }
  