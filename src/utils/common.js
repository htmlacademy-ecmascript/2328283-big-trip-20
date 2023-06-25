function updateItem(items, itemToUpdate) {
  return items.map((item) => item.id === itemToUpdate.id ? itemToUpdate : item);
}

export {updateItem};
