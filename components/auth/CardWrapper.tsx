'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import AuthHearder from './CardWrapperHelper/AuthHeader';
import BackButton from './CardWrapperHelper/BackButton';
import Social from './CardWrapperHelper/Social';

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial: boolean;
}) => {
  return (
    <Card className="w-[95%] bg-white p-3 shadow-md md:w-[600px] lg:w-[500px] xl:w-[500px]">
      <CardHeader>
        <AuthHearder label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {/* si showSocial fait partie des props on la montre */}
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
