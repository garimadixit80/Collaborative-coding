import { Code2, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  return (
    <nav className="bg-midnight backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-lightSteel p-2 rounded-lg">
              <Code2 className="h-6 w-6 text-midnight" />
            </div>
            <span className="text-2xl font-bold text-lightSteel">CodeSync</span>
          </div>



          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
