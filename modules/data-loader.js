var characters;
var charactersAsync = (async () => characters = await (await fetch("/data/characters.json")).json())();

export {characters, charactersAsync};