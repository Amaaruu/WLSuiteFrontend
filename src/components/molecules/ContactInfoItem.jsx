import React from 'react';

const ContactInfoItem = ({ icon: Icon, title, content, isLink, href }) => (
  <div className="flex items-start gap-4">
    <div className="bg-sapphire-100 p-3 rounded-lg text-sapphire-600">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="font-semibold text-gray-900">{title}</p>
      {isLink ? (
        <a href={href} className="text-gray-600 hover:text-sapphire-600 transition-colors">
          {content}
        </a>
      ) : (
        <p className="text-gray-600">{content}</p>
      )}
    </div>
  </div>
);

export default ContactInfoItem;