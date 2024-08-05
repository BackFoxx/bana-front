'use client'

import {Button} from "antd";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/recipe')
  }, []);

  return (
      <Button>맴ㅁ맴</Button>
  );
}
