import { Sketch, SketchBox, SketchText as T } from '../../sketch';

/**
 * The production shape of Island Tours. Reused by the project page and by the
 * Module 17 case study, so the student sees the same drawing both times.
 */
export function IslandToursArchitecture() {
    const arrow = (d: string, accent = false) => (
        <path
            d={d}
            fill='none'
            stroke={accent ? 'var(--primary)' : 'currentColor'}
            strokeOpacity={accent ? 1 : 0.45}
            strokeWidth='1.2'
            markerEnd={accent ? 'url(#it-arrow-a)' : 'url(#it-arrow)'}
        />
    );

    return (
        <Sketch
            label='Architecture: Island Tours in production'
            minWidth={860}
            height={430}
            viewBox='0 0 900 430'
            caption='একটা Request দুই পথে যায়। পাতা দেখতে চাইলে Vercel থেকে আসে, আর Data লাগলে VPS-এর ভেতরে NestJS API পর্যন্ত যায়। পুরো ট্র্যাকে আমরা এই ছবিটার প্রতিটা বাক্স আলাদা করে খুলব।'>
            <defs>
                <marker
                    id='it-arrow'
                    markerWidth='8'
                    markerHeight='8'
                    refX='6'
                    refY='3'
                    orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='currentColor' fillOpacity={0.45} />
                </marker>
                <marker
                    id='it-arrow-a'
                    markerWidth='8'
                    markerHeight='8'
                    refX='6'
                    refY='3'
                    orient='auto'>
                    <path d='M0,0 L0,6 L8,3 z' fill='var(--primary)' />
                </marker>
            </defs>

            {/* user side */}
            <SketchBox x={14} y={96} w={126} h={54} title='BROWSER' sub='ইউজার' accent />
            <T x={77} y={172} size={9} body opacity={0.75}>
                islandtours.com
            </T>

            {arrow('M 146 123 L 186 123', true)}

            <SketchBox
                x={192}
                y={96}
                w={140}
                h={54}
                title='CLOUDFLARE'
                sub='DNS + CDN'
            />
            <T x={262} y={172} size={9} body opacity={0.75}>
                Module 03, 09
            </T>

            {/* two paths out of Cloudflare */}
            {arrow('M 338 112 L 386 62', true)}
            {arrow('M 338 136 L 386 196', true)}

            {/* frontend */}
            <SketchBox
                x={392}
                y={34}
                w={168}
                h={54}
                title='VERCEL'
                sub='Next.js frontend'
            />
            <T x={476} y={106} size={9} body opacity={0.75}>
                পাতা আর ছবি এখান থেকে
            </T>

            {/* the VPS */}
            <rect
                x={382}
                y={150}
                width={498}
                height={214}
                fill='transparent'
                stroke='currentColor'
                strokeOpacity={0.35}
                strokeWidth='1'
                strokeDasharray='5 4'
            />
            <T x={394} y={170} size={9} anchor='start' bold accent>
                HOSTINGER VPS
            </T>
            <T x={872} y={170} size={9} anchor='end' opacity={0.7}>
                Module 06, 07, 08
            </T>

            <SketchBox
                x={396}
                y={182}
                w={128}
                h={52}
                title='CADDY'
                sub='reverse proxy + SSL'
            />
            {arrow('M 530 208 L 566 208', true)}
            <SketchBox
                x={572}
                y={182}
                w={140}
                h={52}
                title='NESTJS API'
                sub='Docker container'
                accent
            />

            {arrow('M 642 240 L 642 276')}
            <SketchBox
                x={572}
                y={282}
                w={140}
                h={52}
                title='POSTGRESQL'
                sub='booking data'
            />

            {arrow('M 718 208 L 754 208')}
            <SketchBox
                x={760}
                y={182}
                w={104}
                h={52}
                title='REDIS'
                sub='cache'
            />

            {/* delivery pipeline */}
            <SketchBox
                x={14}
                y={282}
                w={166}
                h={52}
                title='GITHUB ACTIONS'
                sub='build + deploy'
                dashed
            />
            {arrow('M 186 308 L 388 308')}
            <T x={286} y={300} size={9} body opacity={0.75}>
                push করলেই Deploy
            </T>
            <T x={97} y={352} size={9} body opacity={0.75}>
                Module 12
            </T>

            {/* legend */}
            <path
                d='M 14 392 L 880 392'
                stroke='currentColor'
                strokeOpacity={0.2}
                strokeWidth='1'
            />
            <T x={14} y={414} size={9} anchor='start' body opacity={0.8}>
                কমলা রেখা হলো একটা সাধারণ Request-এর পথ। বাকিগুলো Deploy আর
                ভেতরের যোগাযোগ।
            </T>
        </Sketch>
    );
}
