import { useFieldArray, useFormContext } from 'react-hook-form';
import styles from './Contacts.module.scss';
import { useSession } from 'next-auth/react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Plus from '@icons/plus.svg';
import Trash from '@icons/trash.svg';

export default function Contacts({ content }) {
  const { register, watch, } = useFormContext();
  const { fields, remove, append, } = useFieldArray({ name: 'person.contacts' });
  /* const { data: session } = useSession(); */

  /* const watchAll = watch();
  console.log(watchAll); */

  return (
    <div className={styles.contacts}>
      <h5>Contato(s)</h5>
      {
        fields.map((field, index) => (
          <div key={field.id}>
            <div className="card p-4 position-relative" key={field.id}>
              <Button variant="danger" size="xs" className="position-absolute btn-icon-only top-0 right-0 m-0" onClick={() => remove(index)}>
                <Trash />
              </Button>
              <Form.Row>
                <Col sm="5">
                  <Form.Control as="select" defaultValue="0" {...register(`person.contacts.${index}.contact_type_id`)}>
                    <option disabled value="0">Selecione o tipo</option>
                    <option value="1">Celular</option>
                    <option value="2">Telefone</option>
                    <option value="3">E-mail</option>
                  </Form.Control>
                </Col>
                <Col sm="6">
                  <Form.Control {...register(`person.contacts.${index}.value`)} />
                </Col>
              </Form.Row>
            </div>
          </div>
        ))
      }
      <Button onClick={() => append()} variant="success" size="sm">
        <Plus />
        <span>Adicionar Contato</span>
      </Button>
    </div>
  )
}
