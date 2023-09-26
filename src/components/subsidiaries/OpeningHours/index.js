import styles from './OpeningHours.module.scss';
import { useEffect, useRef, useState } from "react";
import { Button, Col, Collapse, Form, Row } from "react-bootstrap";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import Trash from '@icons/trash.svg';
import { useSession } from 'next-auth/react';
import api from 'services/axios';

export default function OpeningHours() {
  const { register, setValue, getValues, watch } = useFormContext();
  const { fields, remove, append, replace } = useFieldArray({ name: 'times', keyName: 'rhfId' });
  const { register: registerNewTime, handleSubmit: submitNewTime, reset: resetNewTime } = useForm();
  const [showNewTimeForm, setShowNewTimeForm] = useState(false);
  const watchFields = watch();
  const allHours = useRef(null);

  /* console.log(watchFields); */

  function onSubmit(data) {
    let body = { day: getValues('weekDay'), ...data };
    api.post(`/subsidiaries/${watchFields.id}/time`, body)
      /* .then(res => replace(res.data.times.filter(time => time.day === parseInt(watchFields.weekDay)).toSorted((a, b) => parseInt(a.time) - parseInt(b.time)))) */
      .then(() => {
        setShowNewTimeForm(false);
        resetNewTime();
      });
  }

  function deleteTime(timeId, index) {
    api.delete(`/subsidiaries/${watchFields.id}/time/${timeId}`)
    .then(() => remove(index));
  }

  function toggleTime(timeId) {
    api.patch(`/subsidiaries/${watchFields.id}/time/${timeId}/toggle`);
  }

  const week = [
    {
      name: 'Domingo',
      slug: 'dom',
      number: 0,
    },
    {
      name: 'Segunda-feira',
      slug: 'seg',
      number: 1,
    },
    {
      name: 'Terça-feira',
      slug: 'ter',
      number: 2,
    },
    {
      name: 'Quarta-feira',
      slug: 'qua',
      number: 3,
    },
    {
      name: 'Quinta-feira',
      slug: 'qui',
      number: 4,
    },
    {
      name: 'Sexta-feira',
      slug: 'sex',
      number: 5,
    },
    {
      name: 'Sábado',
      slug: 'sab',
      number: 6,
    },
  ];
  const hours = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00"
  ];

  useEffect(() => {
    if (!(watchFields.weekDay && allHours.current)) return;
    setValue('times', allHours.current.filter(f => f.day === parseInt(watchFields.weekDay)));
  }, [watchFields.weekDay]);

  useEffect(() => {
    allHours.current = watchFields.times;
  }, [watchFields.id]);

  return (
    <div className={styles.hours}>

      <hr />
      <h4 className="mb-4">Horários de atendimento</h4>

      <Row className="justify-content-center mb-3" data-toggle="buttons" style={{ gap: '8px' }}>
        {week.map(day => (
          <Button key={day.slug} as="label" htmlFor={day.slug} className={parseInt(watchFields.weekDay) === day.number ? 'active' : ''} style={{ textTransform: 'capitalize' }}>
            <input id={day.slug} value={day.number} type="radio" name="weekDay" {...register('weekDay')} style={{ appearance: 'none' }} />
            {day.name.slice(0, 3)}
          </Button>
        ))}
      </Row>

      <div className="mb-3">
        {watchFields.weekDay ? (
          <div>
            {fields.length ? (
              <div>
                {fields.map((field, index) => (
                  <Row key={field.rhfId} className="mb-3 justify-content-center align-items-center">
                    <Col xs="auto">
                      <Button variant="danger" size="sm" className="btn-icon-only" onClick={() => deleteTime(field.id, index)}>
                        <Trash />
                      </Button>
                    </Col>
                    <Col xs="auto" className="position-relative">
                      <Form.Control disabled as="select" style={{ appearance: 'none' }} {...register(`times.${index}.time`)}>
                        {hours.map(h => <option key={h} value={`${h}:00`}>{h}</option>)}
                      </Form.Control>
                    </Col>
                    <Col xs="auto">
                      <Form.Check
                        custom
                        label="Disponível"
                        type="checkbox"
                        id={`av-${field.id}`}
                        {...register(`times.${index}.available`, { onChange: () => toggleTime(field.id, field.rhfId) })}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
            ) : (
              <h5 className="text-center text-danger">Nenhum horário especificado nesse dia.</h5>
            )}
            <Collapse in={!showNewTimeForm}>
              <div>
                <Button onClick={() => setShowNewTimeForm(true)} block variant="success" size="sm">Adicionar Horário</Button>
              </div>
            </Collapse>
            <Collapse in={showNewTimeForm}>
              <div>
                <Row className="p-3 m-2 border">
                  <Col xs="auto">
                    <Form.Control as="select" {...registerNewTime('time', { required: true })}>
                      {hours.map(h => <option key={h} value={`${h}:00`}>{h}</option>)}
                    </Form.Control>
                  </Col>
                  <Col xs="auto">
                    <Form.Control placeholder="At. Simultâneos" type="number" {...registerNewTime('simultaneous', { required: true })} />
                  </Col>
                  <Col xs="auto" className="mt-2">
                    <Button size="sm" variant="secondary" onClick={() => setShowNewTimeForm(false)}>Cancelar</Button>
                    <Button size="sm" variant="success" onClick={submitNewTime(onSubmit)}>Salvar</Button>
                  </Col>
                </Row>
              </div>
            </Collapse>
          </div>
        ) : (
          <h5 className="text-center text-danger">Selecione um dia da semana.</h5>
        )}
      </div>
    </div>
  )
}
