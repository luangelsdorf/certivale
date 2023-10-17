export function formatPerson(methods, personData) {
  let { contacts, addresses, ...person } = personData;
  methods.reset({ person: person }, { keepSubmitCount: true, keepDefaultValues: true });
  contacts.forEach(contact => {
    if (contact.type === 'TELEFONE' || contact.type === 'CELULAR') methods.setValue(`person.contact.phone`, contact.value);
    if (contact.type === 'EMAIL') methods.setValue(`person.contact.email`, contact.value);
  });
  methods.setValue(`person.address.zip`, addresses[0].zip);
  methods.setValue(`person.address.street`, addresses[0].street);
  methods.setValue(`person.address.number`, addresses[0].number);
  methods.setValue(`person.address.city`, addresses[0].county.name);
  methods.setValue(`person.address.state`, addresses[0].county.state.uf);
  methods.setValue(`person.address.neighborhood`, addresses[0].neighborhood);
  methods.setValue(`person.address.complement`, addresses[0].complement);
}