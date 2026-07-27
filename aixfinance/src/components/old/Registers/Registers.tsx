import React, {  useEffect } from 'react';
import { Container } from '../../utils/utils';
import { RegistersElements } from '@/constants/Registers/RegistersElements';

interface RegistersProps {
}

const Registers: React.FC<RegistersProps> = ({}) => {
  const {
  } = RegistersElements({});

  useEffect(() => {
    fetchRegisters();
  }, []);

  useEffect(() => {
    fetchRegisters();
  }, [refreshRegisters]);

  useEffect(() => {
  }, [registers]);

  return (
    <Container>
      <h1>Registers</h1>
    </Container>
  );
}

export default Registers;
