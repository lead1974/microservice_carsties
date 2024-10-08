'use client'

import { useParamsStore } from '@/hooks/useParamsStore';
import { usePathname, useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();    
    const setParams = useParamsStore(state => state.setParams);
    const setSearchValue = useParamsStore(state => state.setSearchValue);
    const searchValue = useParamsStore(state => state.searchValue);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        console.log('Searching for:', searchValue);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') search();
    };

    function search() {
        if (pathname !== '/') router.push('/');
        setParams({searchTerm: searchValue});
    }

    return (
        <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm justify-between' >
            <input
                onKeyDown={onKeyDown} // Use the typed event handler
                value={searchValue}
                onChange={onChange}
                type="text"
                placeholder='Search for cars by make, model or color'
                className='
                flex-frow
                pl-5
                w-full
                bg-transparent
                focus:outline-none !important
                focus:border-transparent !important
                border-none !important
                focus:border-none !important
                focus:ring-0
                text-sm
                text-gray-600
              '
            />
            <button onClick={search}>
                <FaSearch
                    size={34}
                    className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2' />
            </button>
        </div>
    )
}
