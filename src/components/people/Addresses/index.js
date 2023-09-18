import { useFieldArray, useFormContext } from 'react-hook-form';
import styles from './Addresses.module.scss';
import { Button, Col, Form } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import Plus from '@icons/plus.svg';
import Trash from '@icons/trash.svg';
import cep from '@/utils/cep';

export default function Addresses({ content }) {
  const { register, getValues, setValue, watch, } = useFormContext();
  const { fields, remove, append, } = useFieldArray({ name: 'addresses' });
  const { data: session } = useSession();

  /* const watchAll = watch();
  console.log(watchAll); */

  function getCep(index) {
    cep(getValues(`addresses.${index}.zip`), session.token)
      .then(response => response.ok && response.json())
      .then(response => {
        setValue(`addresses.${index}.street`, response.street);
        setValue(`addresses.${index}.county_ibge_code`, response.county.ibge_code);
      })
      .catch(error => console.error(error));
  }

  return (
    <div className={styles.addresses}>
      <h5>Endereço(s)</h5>
      {
        fields.map((field, index) => (
          <div className="card p-4 position-relative" key={field.id}>
            <Button variant="danger" size="sm" className="position-absolute btn-icon-only top-0 right-0 m-2" onClick={() => remove(index)}>
              <Trash />
            </Button>
            <Form.Row>
              <Col sm="2">
                <Form.Control minLength="8" maxLength="8" placeholder="CEP" className="mb-2" {...register(`addresses.${index}.zip`, { required: true })} />
              </Col>
              <Col sm="auto">
                <Button onClick={() => getCep(index)}>Buscar CEP</Button>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col sm="3">
                <Form.Control disabled placeholder="Rua" className="mb-2" {...register(`addresses.${index}.street`, { required: true })} />
              </Col>
              <Col sm="2">
                <Form.Control placeholder="Número" className="mb-2" {...register(`addresses.${index}.number`, { required: true })} />
              </Col>
              <Col>
                <Form.Control placeholder="Complemento" className="mb-2" {...register(`addresses.${index}.complement`, { required: true })} />
              </Col>
            </Form.Row>
            <Form.Control type="hidden" {...register(`addresses.${index}.county_ibge_code`, { required: true })} />
          </div>
        ))
      }
      <Button onClick={() => append()} variant="success" size="sm">
        <Plus />
        <span>Adicionar Endereço</span>
      </Button>
    </div>
  )
}
