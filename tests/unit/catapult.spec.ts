import { getBoundingClientRect } from '@/util/getBoundingClientRect';
import { Catapult } from "@/Catapult";
import { ICatapultData } from "@/types/ICataoultData";

const testWrapper = document.createElement('div');
testWrapper.id = 'testWrapper';
document.body.appendChild(testWrapper);

describe('Class [catapult]', () => {
    beforeEach(() => {
        testWrapper!.innerHTML = '';
    });

    it('can be import from AMD module and create a new instance', () => {
        const popper = document.createElement('div');
        popper.style.width = '100px';
        popper.style.height = '100px';
        testWrapper.appendChild(popper);

        const trigger = document.createElement('div');
        testWrapper.appendChild(trigger);

        const pop = new Catapult(trigger, popper);
        
        expect(pop).toBeDefined();

        pop.destroy();
    });

    // it('inits a top popper inside document with margins', done => {
    //     const doc = document.documentElement;
    //     doc.style.marginLeft = '300px';
    //     doc.style.marginTop = '300px';
    //     const wrp = document.createElement('div');
    //     wrp.innerHTML = `
    //         <div id="reference"
    //             style="
    //                 width: 100px;
    //                 height: 50px;
    //                 background-color: red;
    //             "
    //         >
    //         </div>
    //         <div id="popper"
    //             style="background: black; color: white; width: 50px;"
    //         >test</div>
    //     `.trim();

    //     const popper = wrp.querySelector('#popper');
    //     const reference = wrp.querySelector('#reference');

    //     document.body.prepend(<HTMLElement>reference);
    //     document.body.prepend(<HTMLElement>popper);

    //     new Catapult(<HTMLElement>reference, <HTMLElement>popper, {
    //         placement: 'top',
    //         onCreate(data: ICatapultData) {
    //             console.log(data);
    //             // TODO: 继续完成该测试
    //             const bottom = popper!.getBoundingClientRect().bottom;
    //             expect(bottom).toBeCloseTo(reference!.getBoundingClientRect().top);

    //             data.instance.destroy();
    //             document.body.removeChild(<HTMLElement>popper);
    //             document.body.removeChild(<HTMLElement>reference);
    //             doc.style.cssText = '';
    //             done();
    //         }
    //     });

    // });
});