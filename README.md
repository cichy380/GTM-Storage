# GTM-Storage

Idea of this solution is based on [HTML5 Local Storage](https://www.w3schools.com/html/html5_webstorage.asp). I did not
want to send data to [Google Tag Manager](http://www.google.pl/tagmanager/) immediately after the event is triggered on
my website.

* Demo: [http://example.silversite.pl/gtm/storage/](http://example.silversite.pl/gtm/storage/)

### Problems with regular solution

On the [Developer Guide](https://developers.google.com/tag-manager/devguide#events) you can see the sample of usage:

```html
<a href="page.html" onclick="dataLayer.push({'event': 'button-click'});">My button</a>
```

where method `dataLayer.push()` starts immediately after clicking on the link. And here you can have the problem with
sending data to [GTM](http://www.google.pl/tagmanager/) because **you have to trust that sending will be faster than
page reloading** to _page.html_. You can use also
[event callback datalayer variable](https://developers.google.com/tag-manager/enhanced-ecommerce#product-clicks) but
cache (GTM-Storage) is better...

### GTM-Storage solution

GTM-Storage **is independent** of [GTM](http://www.google.pl/tagmanager/) and `dataLayer` object. It just creates
numerous elements which the event was made on. In your code you can use storaged data to recursive reading it and
sending to [GTM](http://www.google.pl/tagmanager/) in given interval time.

Saving data to storage and reading it **is safe** because no javascript error will stop the default website event
like page reloading based on
[callback event](https://developers.google.com/tag-manager/enhanced-ecommerce#product-clicks).

## Quick start

Copy the following link to the main GTM-Storage file and paste it to the `<head>` tag on every page of your website:

```html
<script src="gtmstorage.js"></script>
```

Put the following link to the script at the [bottom](https://developer.yahoo.com/performance/rules.html#js_bottom) of
your markup right after [jQuery](https://jquery.com/):

```html
<script src="jquery.js"></script>
<script src="script.js"></script>
```

## Usage

Use [HTML event attributes](https://www.w3schools.com/tags/ref_eventattributes.asp) to set the event in the HTML tag
and call the `gtmStorage.push()` method with `this` argument (HTML DOM element).

Use HTML tag attribute `data-gtm` to set data to send to [GTM](http://www.google.pl/tagmanager/). The attribute
`data-gtm` needs to get value in JSON format with one required property:
 * `event` - custom event name [required]
 * `data` - custom data with any format (object, string, number, bool)

Here is an example: in order to set an event when a user clicks a link, you might modify the link to call the `push()`
and enter data by `data-gtm` as follows:

```html
<a href="#url"
   onclick="gtmStorage.push(this)"
   data-gtm='{"event":"customEventName", "data":{"any":"data","you":"need"}}'>link anchor</a>
```

Feel free to modify _script.js_ file and create any solution you need. For example conditional statements on handling
Ecommerce object format like
[Measuring Product Clicks](https://developers.google.com/tag-manager/enhanced-ecommerce#product-clicks) with required
`ecommerce` property.

### Why DOM Level 0 event model?

In the previous example I used [DOM Level 0](https://www.w3.org/TR/uievents/#dom-level-0) event model. It means
triggering of event in HTML tag property, eg. `<span onclick="gtmStorage.push(this)" />`.

I have chosen this event model because **it works faster**. For example, if you want to use
[DOM Level 2](https://www.w3.org/TR/DOM-Level-2-Events/) event model based on [jQuery](https://jquery.com/), event
listeners start working after DOM is ready. And if your website has 100K lines of code, it is possible that the user
will start using the website before it is ready, and you lose some events and stats. If you paste the _gtmstorage.js_
file in `<head>` and you use [DOM Level 0](https://www.w3.org/TR/uievents/#dom-level-0) event model - you do not lose
the events.

This solution is ready also in content loaded by AJAX.

## License

Code released under the MIT license.
