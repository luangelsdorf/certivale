import styles from './PersonFields.module.scss';
import { Button, Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import Addresses from '../Addresses';
import Contacts from '../Contacts';
import Search from '@icons/magnifying-glass.svg';
import api from 'services/axios';

export default function PersonFields({ action }) {
  const { register, getValues, watch, reset } = useFormContext();
  const watchPersonType = watch('person.person_type');

  /* const watchFields = watch();
  console.log(watchFields); */

  function fillFields(e) {
    let ct = e.currentTarget;
    let document = getValues('person.document');
    api.get(`/people/${document}/document`)
      .then(res => {
        res.data.contacts = res.data.contacts.map(el => {
          return {
            ...el,
            contact_type_id: el.type.replace('CELULAR', '1').replace('TELEFONE', '2').replace('EMAIL', '3')
          }
        });
        reset({ person: res.data }, { keepDefaultValues: true });
        ct?.classList.replace('btn-danger', 'btn-primary');
      })
      .catch(() => ct?.classList.replace('btn-primary', 'btn-danger'))
  }

  return (
    <div>
      {(action.text === 'Editar' || action.text === 'Criar') && (
        <>
          <Form.Row className="flex-nowrap m-0" style={{ gap: '16px' }}>
            <Form.Control
              className="mb-3"
              placeholder="Documento (CPF/CNPJ)"
              {...register('person.document', { required: true, })}
            />
            <Button className="btn-icon-only flex-shrink-0" onClick={fillFields}>
              <Search />
            </Button>
          </Form.Row>
          <Form.Control
            className="mb-3"
            placeholder="Nome"
            {...register('person.name', { required: true, })}
          />
          <Form.Control defaultValue="0" className="mb-3" as="select" {...register('person.person_type', { required: true, })}>
            <option value="0">Tipo de Pessoa</option>
            <option value="F">Pessoa Física</option>
            <option value="J">Pessoa Jurídica</option>
          </Form.Control>
        </>
      )}
      {(watchPersonType === 'J' && (action.text === 'Criar' || action.text === 'Editar')) && (
        <>
          <Form.Control
            className="mb-3"
            placeholder="Nome Fantasia"
            {...register('person.fantasy_name')}
          />
          <Form.Control
            className="mb-3"
            placeholder="Inscrição Estadual"
            {...register('person.state_registration')}
          />
          <Form.Control
            className="mb-3"
            placeholder="Inscrição Municipal"
            {...register('person.county_registration')}
          />
        </>
      )}
      {(watchPersonType === 'F' && (action.text === 'Criar' || action.text === 'Editar')) && (
        <Form.Control
          placeholder="Data de Nascimento"
          onFocus={e => e.target.type = 'date'}
          {...register('person.birth_date', { required: true, onBlur: e => getValues('birth_date')?.length > 0 && (e.target.type = 'text') })}
        />
      )}
      {(action.text === 'Editar' || action.text === 'Criar') && (
        <>
          <hr />
          <Addresses />
          <hr />
          <Contacts />
        </>
      )}
      <Form.Control
        type="hidden"
        {...register('person.id')}
      />
    </div>
  )
}
