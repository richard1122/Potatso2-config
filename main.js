import rp from 'request-promise'
import _ from 'lodash'
import fs from 'fs'

const urls = [
    'http://koolshare.github.io/maintain_files/chnroute.txt',
    'http://koolshare.github.io/maintain_files/cdn.txt'
]

function filterFile(content) {
    return content.split(/\n/).filter(line => {
        return !!line && !line.startsWith('#')
    })
}

async function main() {
    const [chnip, cdn] = (await Promise.all(urls.map(rp))).map(filterFile)
    var template = fs.readFileSync('template.txt', 'utf-8')
    template = template.replace('*bypass-tun*', chnip.join(','))
    template = template.replace('*bypass*', cdn.map(it => {
        return `DOMAIN-SUFFIX,${it},DIRECT`
    }).join('\n'))
    fs.writeFileSync('output.txt', template)
}

main().catch(console.error)