import { Pricing } from '../sections/Pricing';
import { Hero } from '../sections/Hero';
import { Problem } from '../sections/Problem';
import { Connect } from '../sections/Connect';
import { Process } from '../sections/Process';
import { Prototype } from '../sections/Prototype';
import { Validation, Audiences, StackTeaser, Team, CtaBand, OrderBand } from '../sections/HomeSections';

export function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Connect />
      <Process />
      <StackTeaser />
      <Prototype />
      <Pricing />
      <OrderBand />
      <Validation />
      <Audiences />
      <Team />
      <CtaBand />
    </>
  );
}
