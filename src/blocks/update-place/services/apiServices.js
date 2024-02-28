export const updatePlace = async (data) => {

  const response = await fetch(ept_places.update, {
    method: 'POST',
    body: data, 
  });

  return response;
}