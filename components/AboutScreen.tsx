
import React from 'react';
import { QrCodeIcon } from './Icons';

const AboutScreen: React.FC = () => {
  return (
    <div className="text-center py-10">
      <h2 className="font-display text-5xl text-primary mb-12">About</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="p-8 border-4 border-primary rounded-2xl bg-white/50">
           <QrCodeIcon className="w-48 h-48 text-primary" />
        </div>
        <div className="max-w-md text-left">
           <h3 className="font-display text-4xl text-primary mb-4">Scan To Serve</h3>
           <p className="text-xl text-textPrimary font-semibold leading-relaxed">
             The User Can Easy To Place Your Order in ScanTo Serve is Best Way To Place The Order ForTime Save.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
