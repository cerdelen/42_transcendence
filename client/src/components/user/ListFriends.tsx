import React from "react";

interface NameProps {
  name: string;
}

const NameComponent = ({ name }: NameProps) => {
  return <li>{name}</li>;
};

type Props = {
  names: string[];
};

const ListFriends = ({ names }: Props) => {
  return (
    <ul>
      {names.map((name) => (
        <NameComponent key={name} name={name} />
      ))}
    </ul>
  );
};

export default ListFriends;
