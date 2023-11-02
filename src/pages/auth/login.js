import Head from "next/head";
import User from '@icons/user.svg';
import Key from '@icons/key.svg';
import Arrow from '@icons/arrow-right.svg';
import Logo from 'public/images/logo-primary.svg';
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function LoginPage() {

  const { register, handleSubmit } = useForm({
    user: '',
    password: ',',
  });

  function onSubmit(data) {
    signIn('credentials', data);
  }

  return (
    <>
      <Head>
        <title>Login | Certivale</title>
      </Head>

      <div className="min-vh-100 py-5 d-flex flex-column align-items-center justify-content-center" style={{ gap: '40px' }}>
        <Logo width="180" style={{ height: 'auto' }} />
        <div className="w-100">
          <Row className="justify-content-center">
            <Col sm="8" lg="4">
              <Card className="shadow zindex-100 mb-0">
                <Card.Body className="px-md-5 py-5">
                  <div className="mb-5">
                    <h6 className="h3">Bem-vindo!</h6>
                    <p className="text-muted mb-0">Entre na sua conta para continuar.</p>
                  </div>
                  <Form onSubmit={handleSubmit(data => signIn('credentials', data))}>
                    <Form.Group controlId="user">
                      <Form.Label className="form-control-label">Nome de Usuário</Form.Label>
                      <InputGroup className="input-group-merge">
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <User style={{ width: '1em', height: '1em', }} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control autoFocus name="user" {...register('user', { required: true })} />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label className="form-control-label">Senha</Form.Label>
                      <InputGroup className="input-group-merge">
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <Key style={{ width: '1em', height: '1em', }} />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="password" name="password" {...register('password', { required: true })} />
                      </InputGroup>
                    </Form.Group>
                    <div className="mt-4">
                      <Button type="submit" size="sm" className="rounded-pill">
                        <span>Entrar</span>
                        <Arrow />
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

LoginPage.showLayout = false;
