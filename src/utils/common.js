const sortByAsc = (propertyName) => (first, second) => first[propertyName] - second[propertyName];

const sortByDesc = (propertyName) => (first, second) => second[propertyName] - first[propertyName];

const getRandomItem = (iterable) => iterable.get([...iterable.keys()][Math.floor(Math.random() * iterable.size)]);

const capitalizeWord = (word) => word[0].toUpperCase() + word.slice(1);

export { sortByAsc, sortByDesc, getRandomItem, capitalizeWord };
