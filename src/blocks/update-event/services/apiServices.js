export const updateEvent = async (data) => {

  const response = await fetch(ept_events.update, {
    method: 'POST',
    body: data, 
  });

  return response;
}