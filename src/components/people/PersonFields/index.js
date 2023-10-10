import styles from './PersonFields.module.scss';
import { Button, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import Addresses from '../Addresses';
import Contacts from '../Contacts';
import Search from '@icons/magnifying-glass.svg';
import api from 'services/axios';

export default function PersonFields({ action, personType, baseName = 'person' }) {
  const { register, getValues, setValue, watch, reset, formState } = useFormContext();

  /* const watchFields = watch();
  console.log(watchFields); */

  function fillFields(e) {
    let currentTarget = e.currentTarget;
    let document = getValues(`${baseName}.document`);
    api.get(`/people/${document}/document`)
      .then(res => {
        res.data.contacts = res.data.contacts.map(el => {
          return {
            ...el,
            contact_type_id: el.type.replace('CELULAR', '1').replace('TELEFONE', '2').replace('EMAIL', '3')
          }
        });
        reset({ ...getValues(), person: res.data }, { keepDefaultValues: true, keepSubmitCount: true, });
        currentTarget?.classList.replace('btn-danger', 'btn-primary');
        res.data?.addresses?.forEach((address, i) => setValue(`person.addresses.${i}.county_ibge_code`, address.county.ibge_code));
      })
      .catch(() => currentTarget?.classList.replace('btn-primary', 'btn-danger'))
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
                {...register(`${baseName}.document`, { required: isDirty(), })}
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
