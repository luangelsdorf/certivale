import { useFormContext } from 'react-hook-form';
import styles from './Addresses.module.scss';
import { Col, Form, Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import cep from '@/utils/cep';
import { maskCEP } from '@/utils/mask';

export default function Addresses({ baseName = 'person' }) {
  const { register, getValues, setValue, watch, } = useFormContext();
  const { data: session } = useSession();

  /* const watchAll = watch();
  console.log(watchAll); */

  function getCep() {
    cep(getValues(`${baseName}.address.zip`), session.token)
      .then(response => response.ok && response.json())
      .then(response => {
        setValue(`${baseName}.address.city`, response.county.name);
        setValue(`${baseName}.address.state`, response.county.state.uf);
        setValue(`${baseName}.address.street`, response.street);
        setValue(`${baseName}.address.county_ibge_code`, response.county.ibge_code);
        if (response.neighborhood) setValue(`${baseName}.address.neighborhood`, response.neighborhood);
        document.querySelectorAll(`[name="${baseName}.address.city"], [name="${baseName}.address.state"`).forEach(el => el.disabled = true);
      })
      .catch(error => console.error(error));
  }

  return (
    <div className={styles.addresses}>
      <div className="position-relative">
        <Form.Row>
          <Col>
            <Form.Control
              placeholder="CEP"
              className="mb-2"
              {...register(`${baseName}.address.zip`, {
                required: true,
                onBlur: () => getCep(),
                onChange: e => setValue(e.target.name, maskCEP(e.target.value)),
              })}
            />
          </Col>
          {/* <Col sm="auto" className="d-flex align-items-center mb-2">
            <Spinner variant="primary" animation="border" />
          </Col> */}
        </Form.Row>
        <Form.Row>
          <Col sm="6">
            <Form.Control placeholder="Logradouro" className="mb-2" {...register(`${baseName}.address.street`, { required: true })} />
          </Col>
          <Col sm="6">
            <Form.Control type="number" placeholder="Número" className="mb-2" {...register(`${baseName}.address.number`, { required: true })} />
          </Col>
          <Col sm="6">
            <Form.Control placeholder="Cidade" className="mb-2" {...register(`${baseName}.address.city`, { required: true })} />
          </Col>
          <Col sm="6">
            <Form.Control placeholder="Estado" className="mb-2" {...register(`${baseName}.address.state`, { required: true })} />
          </Col>
        </Form.Row>
        <Form.Control placeholder="Bairro" className="mb-2" {...register(`${baseName}.address.neighborhood`, { required: true })} />
        <Form.Control placeholder="Complemento" className="mb-2" {...register(`${baseName}.address.complement`)} />
        <Form.Control type="hidden" {...register(`${baseName}.address.county_ibge_code`, { required: true })} />
      </div>
    </div>
  )
}
