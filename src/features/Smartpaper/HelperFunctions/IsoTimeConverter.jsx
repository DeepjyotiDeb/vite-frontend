const IsoTimeConverter = createdAt => {
  const offsetMs = createdAt.getTimezoneOffset() * 60 * 1000;
  let msLocal = 0;
  if (offsetMs < 0) {
    msLocal = createdAt.getTime() - offsetMs; //subtract if timezone ahead utc
  } else {
    msLocal = createdAt.getTime() + offsetMs; //add if timezone is behind utc
  }
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
};

export default IsoTimeConverter;
