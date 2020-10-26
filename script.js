import {CharTextTest} from "/modules/tests/characters-written.js";
import {charactersAsync, characters} from "/modules/data-loader.js";


addEventListener("load", async () => {
  await charactersAsync;
  console.log(new CharTextTest("tcw-hiragana-romanji",CharTextTest.buildDataSet(characters.kana,"hiragana","romanji"),characters.kanaGroups,[null,"Noto Serif JP"]));
  console.log(new CharTextTest("tcw-romanji-hiragana",CharTextTest.buildDataSet(characters.kana,"romanji","hiragana"),characters.kanaGroups));
  
  console.log(new CharTextTest("tcw-katakana-romanji",CharTextTest.buildDataSet(characters.kana,"katakana","romanji"),characters.kanaGroups,[null,"Noto Serif JP"]));
  console.log(new CharTextTest("tcw-romanji-katakana",CharTextTest.buildDataSet(characters.kana,"romanji","katakana"),characters.kanaGroups));
});
