import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex space-x-4 p-4 bg-gray-100">
      <Link
        href="/cataxpage"
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
      >
        Catax Page
      </Link>
      <Link
        href="/react-flow"
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
      >
        React Flow Page
      </Link>
    </div>
  );
}
