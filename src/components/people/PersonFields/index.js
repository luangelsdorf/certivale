import styles from './PersonFields.module.scss';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import Addresses from '../Addresses';
import Contacts from '../Contacts';

export default function PersonFields({ action }) {
  const { register, getValues, watch } = useFormContext();
  const watchPersonType = watch('person.person_type');

  const watchFields = watch();
  console.log(watchFields);

  return (
    <div>
      {(action.text === 'Editar' || action.text === 'Criar') && (
        <>
          <Form.Control
            className="mb-3"
            placeholder="Documento (CPF/CNPJ)"
            {...register('person.document', { required: true, })}
          />
          <Form.Control
            className="mb-3"
            placeholder="Nome"
            {...register('person.name', { required: true, })}
          />
          <Form.Control defaultValue="F" className="mb-3" as="select" {...register('person.person_type', { required: true, })}>
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
      {action.text === 'Criar' && (
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
