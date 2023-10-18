import styles from './PersonFields.module.scss';
import { Button, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import Addresses from '../Addresses';
import Contacts from '../Contacts';
import Search from '@icons/magnifying-glass.svg';
import api from 'services/axios';
import { maskCNPJ, maskCPF } from '@/utils/mask';

export default function PersonFields({ action, personType, baseName = 'person' }) {
  const { register, getValues, setValue, watch, reset, formState } = useFormContext();

  /* const watchFields = watch();
  console.log(watchFields); */

  function fillFields(e) {
    let currentTarget = e.currentTarget;
    let document = getValues(`${baseName}.document`).replace(/[^0-9]/g, '');
    api.get(`/people/${document}/document`)
      .then(res => {
        reset({ ...getValues(), [baseName]: res.data }, { keepDefaultValues: true, keepSubmitCount: true, });
        res.data.contacts.forEach(con => {
          if (con.type === 'TELEFONE' || con.type === 'CELULAR') setValue(`${baseName}.contact.phone`, con.value);
          if (con.type === 'EMAIL') setValue(`${baseName}.contact.email`, con.value);
        });
        methods.setValue(`${person}.address.zip`, res.data.person.addresses[0].zip);
        methods.setValue(`${person}.address.street`, res.data.person.addresses[0].street);
        methods.setValue(`${person}.address.number`, res.data.person.addresses[0].number);
        methods.setValue(`${person}.address.city`, res.data.person.addresses[0].county.name);
        methods.setValue(`${person}.address.state`, res.data.person.addresses[0].county.state.uf);
        methods.setValue(`${person}.address.neighborhood`, res.data.person.addresses[0].neighborhood);
        methods.setValue(`${person}.address.complement`, res.data.person.addresses[0].complement);
        currentTarget?.classList.replace('btn-danger', 'btn-primary');
      })
      .catch((error) => {
        console.error(error);
        currentTarget?.classList.replace('btn-primary', 'btn-danger')
      })
  }

  const isDirty = () => !!Object.keys(formState.dirtyFields).length;

  if (personType) {
    return (
      <div className="mb-3">
        {(action.text === 'Editar' || action.text === 'Criar') && (
          <>
            <Form.Row className="flex-nowrap m-0" style={{ gap: '16px' }}>
              <Form.Control
                className="mb-3"
                placeholder={personType === 'F' ? 'CPF' : 'CNPJ'}
                {...register(`${baseName}.document`, {
                  required: isDirty(),
                  onChange: ({ target }) => {
                    setValue(target.name, personType === 'F' ? maskCPF(target.value) : maskCNPJ(target.value));
                  },
                })}
              />
              <Button className="btn-icon-only flex-shrink-0" onClick={fillFields}>
                <Search />
              </Button>
            </Form.Row>
            <Form.Control
              className="mb-3"
              placeholder="Nome"
              {...register(`${baseName}.name`, { required: isDirty(), })}
            />
            <Contacts baseName={baseName} />
          </>
        )}
        {(personType === 'J' && (action.text === 'Criar' || action.text === 'Editar')) && (
          <>
            <Form.Control
              className="mb-3"
              placeholder="Nome Fantasia"
              {...register(`${baseName}.fantasy_name`, { required: isDirty() })}
            />
          </>
        )}
        {(personType === 'F' && (action.text === 'Criar' || action.text === 'Editar')) && (
          <Form.Control
            placeholder="Data de Nascimento"
            onFocus={e => e.target.type = 'date'}
            {...register(`${baseName}.birth_date`, { required: isDirty(), onBlur: e => getValues('birth_date')?.length > 0 && (e.target.type = 'text') })}
          />
        )}
        {(action.text === 'Editar' || action.text === 'Criar') && (
          <>
            <hr className="my-4" />
            <Addresses baseName={baseName} />
          </>
        )}
        <Form.Control
          type="hidden"
          {...register(`${baseName}.id`)}
        />
      </div>
    )
  }
}
