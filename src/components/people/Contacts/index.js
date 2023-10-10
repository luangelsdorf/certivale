import { useFieldArray, useFormContext } from 'react-hook-form';
import styles from './Contacts.module.scss';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export default function Contacts({ baseName = 'person' }) {
  const { register, setValue, watch, } = useFormContext();
  /* const { data: session } = useSession(); */

  /* const watchAll = watch();
  console.log(watchAll); */

  function phoneMask(phone) {
    if (phone.length <= 14) {
      return phone.replace(/\D/g, '')
        .replace(/^(\d)/, '($1')
        .replace(/^(\(\d{2})(\d)/, '$1) $2')
        .replace(/(\d{4})(\d{1,5})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return phone.replace(/\D/g, '')
        .replace(/^(\d)/, '($1')
        .replace(/^(\(\d{2})(\d)/, '$1) $2')
        .replace(/(\d{5})(\d{1,5})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  }

  return (
    <div className={styles.contacts}>
      <div className="position-relative">
        <Form.Row>
          <Col>
            <Form.Control
              className="mb-3"
              placeholder="Telefone"
              {...register(`${baseName}.contact.phone`, { required: true, onChange: e => setValue(`${baseName}.contact.phone`, phoneMask(e.target.value)) })}
            />
          </Col>
          <Col>
            <Form.Control
              className="mb-3"
              placeholder="E-mail"
              type="email"
              {...register(`${baseName}.contact.email`, { required: true })}
            />
          </Col>
        </Form.Row>
      </div>
    </div>
  )
}
